// Menu Mobile
const buttonMenuMobile = document.querySelector(".header .inner-button-menu");
if (buttonMenuMobile) {
  const sider = document.querySelector(".sider");
  const siderOverlay = document.querySelector(".sider-overlay");

  buttonMenuMobile.addEventListener("click", () => {
    sider.classList.add("active");
    siderOverlay.classList.add("active");
  });

  siderOverlay.addEventListener("click", () => {
    sider.classList.remove("active");
    siderOverlay.classList.remove("active");
  });
}
// End Menu Mobile

// Schedule Section 8
const scheduleSection8 = document.querySelector(".section-8 .inner-schedule");
if (scheduleSection8) {
  const buttonCreate = scheduleSection8.querySelector(".inner-schedule-create");
  const listItem = scheduleSection8.querySelector(".inner-schedule-list");

  // Tạo mới
  if (buttonCreate) {
    buttonCreate.addEventListener("click", () => {
      const firstItem = listItem.querySelector(".inner-schedule-item");
      const cloneItem = firstItem.cloneNode(true);
      cloneItem.querySelector(".inner-schedule-head input").value = "";

      const body = cloneItem.querySelector(".inner-schedule-body");
      const id = `mce_${Date.now()}`;
      body.innerHTML = `<textarea textarea-mce id="${id}"></textarea>`;

      listItem.appendChild(cloneItem);

      initTinyMCE(`#${id}`);
    });
  }

  listItem.addEventListener("click", (event) => {
    // Đóng/mở item
    if (event.target.closest(".inner-more")) {
      const parentItem = event.target.closest(".inner-schedule-item");
      if (parentItem) {
        parentItem.classList.toggle("hidden");
      }
    }

    // Xóa item
    if (event.target.closest(".inner-remove")) {
      const parentItem = event.target.closest(".inner-schedule-item");
      const totalItem = listItem.querySelectorAll(
        ".inner-schedule-item"
      ).length;
      if (parentItem && totalItem > 1) {
        parentItem.remove();
      }
    }
  });

  // Sắp xếp
  new Sortable(listItem, {
    animation: 150, // Thêm hiệu ứng mượt mà
    handle: ".inner-move", // Chỉ cho phép kéo bằng class .inner-move
    onStart: (event) => {
      const textarea = event.item.querySelector("[textarea-mce]");
      const id = textarea.id;
      tinymce.get(id).remove();
    },
    onEnd: (event) => {
      const textarea = event.item.querySelector("[textarea-mce]");
      const id = textarea.id;
      initTinyMCE(`#${id}`);
    },
  });
}
// End Schedule Section 8

// Filepond Image
const listFilepondImage = document.querySelectorAll("[filepond-image]");
let filePond = {};
if (listFilepondImage.length > 0) {
  listFilepondImage.forEach((filepondImage) => {
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginFileValidateType);

    let files = null;
    const elementImageDefault = filepondImage.closest("[image-default]");
    if (elementImageDefault) {
      const imageDefault = elementImageDefault.getAttribute("image-default");
      if (imageDefault) {
        files = [
          {
            source: imageDefault,
          },
        ];
      }
    }

    filePond[filepondImage.name] = FilePond.create(filepondImage, {
      labelIdle: "+",
      files: files,
    });
  });
}
// End Filepond Image

// Filepond Image Multi
const listFilepondImageMulti = document.querySelectorAll(
  "[filepond-image-multi]"
);
let filePondMulti = {};
if (listFilepondImageMulti.length > 0) {
  listFilepondImageMulti.forEach((filepondImage) => {
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginFileValidateType);

    let files = null;
    const elementListImageDefault = filepondImage.closest(
      "[list-image-default]"
    );
    if (elementListImageDefault) {
      let listImageDefault =
        elementListImageDefault.getAttribute("list-image-default");
      if (listImageDefault) {
        listImageDefault = JSON.parse(listImageDefault);
        files = [];
        listImageDefault.forEach((image) => {
          files.push({
            source: image, // Đường dẫn ảnh
          });
        });
      }
    }

    filePondMulti[filepondImage.name] = FilePond.create(filepondImage, {
      labelIdle: "+",
      files: files,
    });
  });
}
// End Filepond Image Multi

// Biểu đồ doanh thu
const drawChart = (dateFilter) => {
  // Lay ra thoi gian hien tai
  const now = dateFilter;
  const curMonth = now.getMonth() + 1;
  const curYear = now.getFullYear();

  // Lay ra thoi gian 1 thang truoc
  const previosMonthDate = new Date(curYear, now.getMonth() - 1, 1);
  const previousMonth = previosMonthDate.getMonth() + 1;
  const previousYear = previosMonthDate.getFullYear();

  // Lay ra so ngay
  const daysInCurrentMonth = new Date(curYear, curMonth, 0).getDate();
  const daysInPreviousMonth = new Date(
    previousYear,
    previousMonth,
    0
  ).getDate();
  const days =
    daysInCurrentMonth > daysInPreviousMonth
      ? daysInCurrentMonth
      : daysInPreviousMonth;
  const arrayDate = [];
  for (let i = 1; i <= days; i++) {
    arrayDate.push(i);
  }

  // Gui va nhan du lieu tu backend
  const dataFinal = {
    curMonth: curMonth,
    curYear: curYear,
    previousMonth: previousMonth,
    previousYear: previousYear,
    arrayDate: arrayDate,
  };

  fetch(`/${pathAdmin}/dashboard/revenue-chart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataFinal),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code == "success") {
        const stringCanvas = `<canvas></canvas>`;
        const parentChart = document.querySelector('.section-2 .inner-chart');
        parentChart.innerHTML = stringCanvas;
        const canvas = parentChart.querySelector("canvas");
        new Chart(canvas, {
          type: "line",
          data: {
            labels: arrayDate,
            datasets: [
              {
                label: `Tháng ${curMonth}/${curYear}`, // Nhãn của dataset
                data: data.dataCurrentMonth, // Dữ liệu
                borderColor: "#4379EE", // Màu viền
                borderWidth: 1.5, // Độ dày của đường
              },
              {
                label: `Tháng ${previousMonth}/${previousYear}`, // Nhãn của dataset
                data: data.dataPreviousMonth, // Dữ liệu
                borderColor: "#EF3826", // Màu viền
                borderWidth: 1.5, // Độ dày của đường
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                position: "bottom",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Ngày",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Doanh thu (VND)",
                },
              },
            },
            maintainAspectRatio: false, // Không giữ tỷ lệ khung hình mặc định
          },
        });
      }
    });
};

const revenueChart = document.querySelector("#revenue-chart");
if (revenueChart) {
  drawChart(new Date());

  const inputFilterMonth = document.querySelector('[month-filter]');
  inputFilterMonth.addEventListener('change', () => {
    const value = inputFilterMonth.value;
    const dateFilter = new Date(value);
    drawChart(dateFilter);
  })
}
// Hết Biểu đồ doanh thu

// Category Create Form
const categoryCreateForm = document.querySelector("#category-create-form");
if (categoryCreateForm) {
  const validation = new JustValidate("#category-create-form");

  validation
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên danh mục!",
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const parent = event.target.parent.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }
      const description = tinymce.get("description").getContent();

      const finalForm = new FormData();
      finalForm.append("name", name);
      finalForm.append("parent", parent);
      finalForm.append("position", position);
      finalForm.append("status", status);
      finalForm.append("avatar", avatar);
      finalForm.append("description", description);

      const loader = document.getElementById("loader");
      loader.style.display = "block";
      const btnSummit = document.querySelector("#btnSummit");
      btnSummit.style.display = "none";

      fetch(`/${pathAdmin}/category/create`, {
        method: "POST",
        body: finalForm,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "error") {
            notyf.error(data.message);
            btnSummit.style.display = "inline";
          } else {
            notify(data.code, data.message);
            window.location.reload();
          }
        });
    });
}
// End Category Create Form

// Category Edit Form
const categoryEditForm = document.querySelector("#category-edit-form");
if (categoryEditForm) {
  const validation = new JustValidate("#category-edit-form");

  validation
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên danh mục!",
      },
    ])
    .onSuccess((event) => {
      const id = event.target.ID.value;
      const name = event.target.name.value;
      const parent = event.target.parent.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
        const elementImageDefault =
          event.target.avatar.closest("[image-default]");
        const imageDefault = elementImageDefault.getAttribute("image-default");
        if (imageDefault.includes(avatar.name)) {
          avatar = undefined;
        }
      }

      const description = tinymce.get("description").getContent();

      const finalForm = new FormData();
      finalForm.append("name", name);
      finalForm.append("parent", parent);
      finalForm.append("position", position);
      finalForm.append("status", status);
      finalForm.append("avatar", avatar);
      finalForm.append("description", description);

      const loader = document.getElementById("loader");
      loader.style.display = "block";
      const btnSummit = document.querySelector("#btnSummit");
      btnSummit.style.display = "none";

      fetch(`/${pathAdmin}/category/edit/${id}`, {
        method: "PATCH",
        body: finalForm,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "error") {
            notyf.error(data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
          } else {
            notyf.success(data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
          }
        });
    });
}
// End Category Edit Form

// Tour Create Form
const tourCreateForm = document.querySelector("#tour-create-form");
if (tourCreateForm) {
  const validation = new JustValidate("#tour-create-form");

  validation
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên tour!",
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const category = event.target.category.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }
      const priceAdult = event.target.priceAdult.value;
      const priceChildren = event.target.priceChildren.value;
      const priceBaby = event.target.priceBaby.value;
      const priceNewAdult = event.target.priceNewAdult.value;
      const priceNewChildren = event.target.priceNewChildren.value;
      const priceNewBaby = event.target.priceNewBaby.value;
      const stockAdult = event.target.stockAdult.value;
      const stockChildren = event.target.stockChildren.value;
      const stockBaby = event.target.stockBaby.value;
      const locations = [];
      const time = event.target.time.value;
      const vehicle = event.target.vehicle.value;
      const departureDate = event.target.departureDate.value;
      const information = tinymce.get("information").getContent();
      const schedules = [];

      // locations
      const listElementLocation = tourCreateForm.querySelectorAll(
        'input[name="locations"]:checked'
      );
      listElementLocation.forEach((input) => {
        locations.push(input.value);
      });
      // End locations

      // schedules
      const listElementScheduleItem = tourCreateForm.querySelectorAll(
        ".inner-schedule-item"
      );
      listElementScheduleItem.forEach((scheduleItem) => {
        const input = scheduleItem.querySelector("input");
        const title = input.value;

        const textarea = scheduleItem.querySelector("textarea");
        const idTextarea = textarea.id;
        const description = tinymce.get(idTextarea).getContent();

        schedules.push({
          title: title,
          description: description,
        });
      });
      // End schedules

      const finalForm = new FormData();

      finalForm.append("name", name);
      finalForm.append("category", category);
      finalForm.append("position", position);
      finalForm.append("status", status);
      finalForm.append("avatar", avatar);
      finalForm.append("priceAdult", priceAdult);
      finalForm.append("priceChildren", priceChildren);
      finalForm.append("priceBaby", priceBaby);
      finalForm.append("priceNewAdult", priceNewAdult);
      finalForm.append("priceNewChildren", priceNewChildren);
      finalForm.append("priceNewBaby", priceNewBaby);
      finalForm.append("stockAdult", stockAdult);
      finalForm.append("stockChildren", stockChildren);
      finalForm.append("stockBaby", stockBaby);
      finalForm.append("locations", JSON.stringify(locations));
      finalForm.append("time", time);
      finalForm.append("vehicle", vehicle);
      finalForm.append("departureDate", departureDate);
      finalForm.append("information", information);
      finalForm.append("schedules", JSON.stringify(schedules));

      const loader = document.getElementById("loader");
      loader.style.display = "block";
      const btnSummit = document.querySelector("#btnSummit");
      btnSummit.style.display = "none";

      // images
      if (filePondMulti.images.getFiles().length > 0) {
        filePondMulti.images.getFiles().forEach((item) => {
          finalForm.append("images", item.file);
        });
      }
      // End images

      fetch(`/${pathAdmin}/tour/create`, {
        method: "POST",
        body: finalForm,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "error") {
            notyf.error(data.message);
            btnSummit.style.display = "inline";
          } else {
            notify(data.code, data.message);
            window.location.reload();
          }
        });
    });
}
// End Tour Create Form

//Tour Edit
const tourEditForm = document.querySelector("#tour-edit-form");
if (tourEditForm) {
  const validation = new JustValidate("#tour-edit-form");

  validation
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên tour!",
      },
    ])
    .onSuccess((event) => {
      const id = event.target.ID.value;
      const name = event.target.name.value;
      const category = event.target.category.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
        const elementImageDefault =
          event.target.avatar.closest("[image-default]");
        const imageDefault = elementImageDefault.getAttribute("image-default");
        if (imageDefault.includes(avatar.name)) {
          avatar = undefined;
        }
      }
      const priceAdult = event.target.priceAdult.value;
      const priceChildren = event.target.priceChildren.value;
      const priceBaby = event.target.priceBaby.value;
      const priceNewAdult = event.target.priceNewAdult.value;
      const priceNewChildren = event.target.priceNewChildren.value;
      const priceNewBaby = event.target.priceNewBaby.value;
      const stockAdult = event.target.stockAdult.value;
      const stockChildren = event.target.stockChildren.value;
      const stockBaby = event.target.stockBaby.value;
      const locations = [];
      const time = event.target.time.value;
      const vehicle = event.target.vehicle.value;
      const departureDate = event.target.departureDate.value;
      const information = tinymce.get("information").getContent();
      const schedules = [];

      // locations
      const listElementLocation = tourEditForm.querySelectorAll(
        'input[name="locations"]:checked'
      );
      listElementLocation.forEach((input) => {
        locations.push(input.value);
      });
      // End locations

      // schedules
      const listElementScheduleItem = tourEditForm.querySelectorAll(
        ".inner-schedule-item"
      );
      listElementScheduleItem.forEach((scheduleItem) => {
        const input = scheduleItem.querySelector("input");
        const title = input.value;

        const textarea = scheduleItem.querySelector("textarea");
        const idTextarea = textarea.id;
        const description = tinymce.get(idTextarea).getContent();

        schedules.push({
          title: title,
          description: description,
        });
      });
      // End schedules

      const finalForm = new FormData();

      finalForm.append("name", name);
      finalForm.append("category", category);
      finalForm.append("position", position);
      finalForm.append("status", status);
      finalForm.append("avatar", avatar);
      finalForm.append("priceAdult", priceAdult);
      finalForm.append("priceChildren", priceChildren);
      finalForm.append("priceBaby", priceBaby);
      finalForm.append("priceNewAdult", priceNewAdult);
      finalForm.append("priceNewChildren", priceNewChildren);
      finalForm.append("priceNewBaby", priceNewBaby);
      finalForm.append("stockAdult", stockAdult);
      finalForm.append("stockChildren", stockChildren);
      finalForm.append("stockBaby", stockBaby);
      finalForm.append("locations", JSON.stringify(locations));
      finalForm.append("time", time);
      finalForm.append("vehicle", vehicle);
      finalForm.append("departureDate", departureDate);
      finalForm.append("information", information);
      finalForm.append("schedules", JSON.stringify(schedules));

      const loader = document.getElementById("loader");
      loader.style.display = "block";
      const btnSummit = document.querySelector("#btnSummit");
      btnSummit.style.display = "none";

      // images
      if (filePondMulti.images.getFiles().length > 0) {
        filePondMulti.images.getFiles().forEach((item) => {
          finalForm.append("images", item.file);
        });
      }
      // End images

      fetch(`/${pathAdmin}/tour/edit/${id}`, {
        method: "PATCH",
        body: finalForm,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "error") {
            notyf.error(data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
          } else {
            notyf.success(data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
          }
        });
    });
}
//End Tour Edit

// Order Edit Form
const orderEditForm = document.querySelector("#order-edit-form");
if (orderEditForm) {
  const validation = new JustValidate("#order-edit-form");

  validation
    .addField("#fullName", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên!",
      },
      {
        rule: "minLength",
        value: 5,
        errorMessage: "Họ tên phải có ít nhất 5 ký tự!",
      },
      {
        rule: "maxLength",
        value: 50,
        errorMessage: "Họ tên không được vượt quá 50 ký tự!",
      },
    ])
    .addField("#phone", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại!",
      },
      {
        rule: "customRegexp",
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: "Số điện thoại không đúng định dạng!",
      },
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const fullName = event.target.fullName.value;
      const phone = event.target.phone.value;
      const note = event.target.note.value;
      const paymentMethod = event.target.paymentMethod.value;
      const paymentStatus = event.target.paymentStatus.value;
      const status = event.target.status.value;

      const dataFinal = {
        fullName: fullName,
        phone: phone,
        note: note,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        status: status,
      };

      fetch(`/${pathAdmin}/order/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFinal),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "error") {
            notyf.error(data.message);
          }

          if (data.code == "success") {
            notify(data.code, data.message);
            window.location.reload();
          }
        });
    });
}
// End Order Edit Form

// Setting Website Info Form
const settingWebsiteInfoForm = document.querySelector(
  "#setting-website-info-form"
);
if (settingWebsiteInfoForm) {
  const validation = new JustValidate("#setting-website-info-form");

  validation
    .addField("#websiteName", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên website!",
      },
    ])
    .addField("#email", [
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .onSuccess((event) => {
      const websiteName = event.target.websiteName.value;
      const phone = event.target.phone.value;
      const email = event.target.email.value;
      const address = event.target.address.value;
      const logos = filePond.logo.getFiles();
      let logo = null;
      if (logos.length > 0) {
        logo = logos[0].file;
        const elementImageDefault =
          event.target.logo.closest("[image-default]");
        const imageDefault = elementImageDefault.getAttribute("image-default");
        if (imageDefault.includes(logo.name)) {
          logo = undefined;
        }
      }

      const favicons = filePond.favicon.getFiles();
      let favicon = null;
      if (favicons.length > 0) {
        favicon = favicons[0].file;
        const elementImageDefault =
          event.target.favicon.closest("[image-default]");
        const imageDefault = elementImageDefault.getAttribute("image-default");
        if (imageDefault.includes(favicon.name)) {
          favicon = undefined;
        }
      }

      const finalForm = new FormData();

      finalForm.append("websiteName", websiteName);
      finalForm.append("phone", phone);
      finalForm.append("email", email);
      finalForm.append("address", address);
      finalForm.append("logo", logo);
      finalForm.append("favicon", favicon);

      const loader = document.getElementById("loader");
      loader.style.display = "block";
      const btnSummit = document.querySelector("#btnSummit");
      btnSummit.style.display = "none";

      fetch(`/${pathAdmin}/setting/web-info`, {
        method: "PATCH",
        body: finalForm,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "error") {
            notyf.error(data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
          } else {
            notyf.success(data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
            window.location.reload();
          }
        });
    });
}
// End Setting Website Info Form

// Setting Account Admin Create Form
const settingAccountAdminCreateForm = document.querySelector(
  "#setting-account-admin-create-form"
);
if (settingAccountAdminCreateForm) {
  const validation = new JustValidate("#setting-account-admin-create-form");

  validation
    .addField("#fullName", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên!",
      },
      {
        rule: "minLength",
        value: 5,
        errorMessage: "Họ tên phải có ít nhất 5 ký tự!",
      },
      {
        rule: "maxLength",
        value: 50,
        errorMessage: "Họ tên không được vượt quá 50 ký tự!",
      },
    ])
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .addField("#phone", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại!",
      },
      {
        rule: "customRegexp",
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: "Số điện thoại không đúng định dạng!",
      },
    ])
    .addField("#positionCompany", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập chức vụ!",
      },
    ])
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!",
      },
      {
        validator: (value) => value.length >= 8,
        errorMessage: "Mật khẩu phải chứa ít nhất 8 ký tự!",
      },
      {
        validator: (value) => /[A-Z]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
      },
      {
        validator: (value) => /[a-z]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái thường!",
      },
      {
        validator: (value) => /\d/.test(value),
        errorMessage: "Mật khẩu phải chứa ít nhất một chữ số!",
      },
      {
        validator: (value) => /[@$!%*?&]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const role = event.target.role.value;
      const positionCompany = event.target.positionCompany.value;
      const status = event.target.status.value;
      const password = event.target.password.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
      }

      const finalForm = new FormData();
      finalForm.append("fullName", fullName);
      finalForm.append("email", email);
      finalForm.append("phone", phone);
      finalForm.append("role", role);
      finalForm.append("positionCompany", positionCompany);
      finalForm.append("status", status);
      finalForm.append("password", password);
      finalForm.append("avatar", avatar);

      const loader = document.getElementById("loader");
      loader.style.display = "block";
      const btnSummit = document.querySelector("#btnSummit");
      btnSummit.style.display = "none";

      fetch(`/${pathAdmin}/setting/account-admin/create`, {
        method: "POST",
        body: finalForm,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "error") {
            notyf.error(data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
          } else {
            notify(data.code, data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
            window.location.reload();
          }
        });
    });
}
// End Setting Account Admin Create Form

// Setting Account Admin Edit Form
const settingAccountAdminEditForm = document.querySelector(
  "#setting-account-admin-edit-form"
);
if (settingAccountAdminEditForm) {
  const validation = new JustValidate("#setting-account-admin-edit-form");

  validation
    .addField("#fullName", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên!",
      },
      {
        rule: "minLength",
        value: 5,
        errorMessage: "Họ tên phải có ít nhất 5 ký tự!",
      },
      {
        rule: "maxLength",
        value: 50,
        errorMessage: "Họ tên không được vượt quá 50 ký tự!",
      },
    ])
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .addField("#phone", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại!",
      },
      {
        rule: "customRegexp",
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: "Số điện thoại không đúng định dạng!",
      },
    ])
    .addField("#positionCompany", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập chức vụ!",
      },
    ])
    .onSuccess((event) => {
      const id = event.target.ID.value;
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const role = event.target.role.value;
      const positionCompany = event.target.positionCompany.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if (avatars.length > 0) {
        avatar = avatars[0].file;
        const elementImageDefault =
          event.target.avatar.closest("[image-default]");
        if (elementImageDefault) {
          const imageDefault =
            elementImageDefault.getAttribute("image-default");
          if (imageDefault.includes(avatar.name)) {
            avatar = undefined;
          }
        }
      }
      const finalForm = new FormData();
      finalForm.append("fullName", fullName);
      finalForm.append("email", email);
      finalForm.append("phone", phone);
      finalForm.append("role", role);
      finalForm.append("positionCompany", positionCompany);
      finalForm.append("status", status);
      finalForm.append("avatar", avatar);

      const loader = document.getElementById("loader");
      loader.style.display = "block";
      const btnSummit = document.querySelector("#btnSummit");
      btnSummit.style.display = "none";

      fetch(`/${pathAdmin}/setting/account-admin/edit/${id}`, {
        method: "PATCH",
        body: finalForm,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "error") {
            notyf.error(data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
          } else {
            notify(data.code, data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
            window.location.reload();
          }
        });
    });
}
// End Setting Account Admin Edit Form

// Setting Role Create Form
const settingRoleCreateForm = document.querySelector(
  "#setting-role-create-form"
);
if (settingRoleCreateForm) {
  const validation = new JustValidate("#setting-role-create-form");

  validation
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên nhóm quyền!",
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const description = event.target.description.value;
      const permissions = [];

      // permissions
      const listElementPermission = settingRoleCreateForm.querySelectorAll(
        'input[name="permissions"]:checked'
      );
      listElementPermission.forEach((input) => {
        permissions.push(input.value);
      });
      // End permissions

      const finalData = {
        name: name,
        description: description,
        permissions: permissions,
      };

      const loader = document.getElementById("loader");
      loader.style.display = "block";
      const btnSummit = document.querySelector("#btnSummit");
      btnSummit.style.display = "none";

      fetch(`/${pathAdmin}/setting/role/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "error") {
            notyf.error(data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
          } else {
            notify(data.code, data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
            window.location.reload();
          }
        });
    });
}
// End Setting Role Create Form

//Setting Sales
const settingSaleForm = document.querySelector("#setting-sales-form");
if (settingSaleForm) {
  const validation = new JustValidate("#setting-sales-form");

  validation
    .addField("#saleName", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên ưu đãi!",
      },
    ])
    .onSuccess((event) => {
      const saleName = event.target.saleName.value;
      const endDate = event.target.endDate.value;
      const salePrice = event.target.salePrice.value;
      const saleTour = [];

      //saleTour
      const listElementSales = settingSaleForm.querySelectorAll(
        'input[name="saleTour"]:checked'
      );
      listElementSales.forEach((input) => {
        saleTour.push(input.value);
      });
      //End saleTour

      const finalData = {
        saleName: saleName,
        endDate: endDate,
        salePrice: salePrice,
        saleTour: JSON.stringify(saleTour),
      };

      const loader = document.getElementById("loader");
      loader.style.display = "block";
      const btnSummit = document.querySelector("#btnSummit");
      btnSummit.style.display = "none";

      fetch(`/${pathAdmin}/setting/sales`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "error") {
            notyf.error(data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
          } else {
            notyf.success(data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
            window.location.reload();
          }
        });
    });
}
//End Setting Sales

// Profile Edit Form
const profileEditForm = document.querySelector("#profile-edit-form");
if (profileEditForm) {
  const validation = new JustValidate("#profile-edit-form");

  validation
    .addField("#fullName", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên!",
      },
      {
        rule: "minLength",
        value: 5,
        errorMessage: "Họ tên phải có ít nhất 5 ký tự!",
      },
      {
        rule: "maxLength",
        value: 50,
        errorMessage: "Họ tên không được vượt quá 50 ký tự!",
      },
    ])
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .addField("#phone", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại!",
      },
      {
        rule: "customRegexp",
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: "Số điện thoại không đúng định dạng!",
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;

      if (avatars.length > 0) {
        avatar = avatars[0].file;
        const elementImageDefault =
          event.target.avatar.closest("[image-default]");
        const imageDefault = elementImageDefault.getAttribute("image-default");
        if (imageDefault.includes(avatar.name)) {
          avatar = undefined;
        }
      }

      const finalForm = new FormData();
      finalForm.append("fullName", fullName);
      finalForm.append("email", email);
      finalForm.append("phone", phone);
      finalForm.append("avatar", avatar);

      const loader = document.getElementById("loader");
      loader.style.display = "block";
      const btnSummit = document.querySelector("#btnSummit");
      btnSummit.style.display = "none";

      fetch(`/${pathAdmin}/profile/edit`, {
        method: "PATCH",
        body: finalForm,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "error") {
            notyf.error(data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
          } else {
            notify(data.code, data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
            window.location.reload();
          }
        });
    });
}
// End Profile Edit Form

// Profile Change Password Form
const profileChangePasswordForm = document.querySelector(
  "#profile-change-password-form"
);
if (profileChangePasswordForm) {
  const validation = new JustValidate("#profile-change-password-form");

  validation
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!",
      },
      {
        validator: (value) => value.length >= 8,
        errorMessage: "Mật khẩu phải chứa ít nhất 8 ký tự!",
      },
      {
        validator: (value) => /[A-Z]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
      },
      {
        validator: (value) => /[a-z]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái thường!",
      },
      {
        validator: (value) => /\d/.test(value),
        errorMessage: "Mật khẩu phải chứa ít nhất một chữ số!",
      },
      {
        validator: (value) => /[@$!%*?&]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
      },
    ])
    .addField("#confirmPassword", [
      {
        rule: "required",
        errorMessage: "Vui lòng xác nhận mật khẩu!",
      },
      {
        validator: (value, fields) => {
          const password = fields["#password"].elem.value;
          return value == password;
        },
        errorMessage: "Mật khẩu xác nhận không khớp!",
      },
    ])
    .onSuccess((event) => {
      const password = event.target.password.value;
      console.log(password);

      const finalData = {
        password: password,
      };

      fetch(`/${pathAdmin}/profile/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "error") {
            notyf.error(data.message);
          } else {
            notify(data.code, data.message);
            window.location.reload();
          }
        });
    });
}
// End Profile Change Password Form

//sider
const sider = document.querySelector(".sider");
if (sider) {
  const menuItems = sider.querySelectorAll("a");
  const pathCurent = location.pathname.split("/");
  menuItems.forEach((item) => {
    const pathItem = item.getAttribute("href").split("/");
    if (pathItem[1] === pathCurent[1] && pathItem[2] === pathCurent[2]) {
      item.classList.add("active");
    }
  });
}
//end sider

//Logout
const btnLogOut = document.querySelector(".sider .inner-logout");
if (btnLogOut) {
  btnLogOut.addEventListener("click", () => {
    fetch(`/${pathAdmin}/account/logout`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "error") {
          notyf.error(data.message);
        } else {
          notify(data.code, data.message);
          window.location.href = `/${pathAdmin}/account/login`;
        }
      });
  });
}
//End logout

// Button Delete
const listBtnDelete = document.querySelectorAll("[btn-delete]");
if (listBtnDelete.length > 0) {
  listBtnDelete.forEach((btn) => {
    btn.addEventListener("click", () => {
      const dataApi = btn.getAttribute("data-api");
      fetch(dataApi, {
        method: "PATCH",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "error") {
            notyf.error(data.message);
          } else {
            notify(data.code, data.message);
            window.location.reload();
          }
        });
    });
  });
}
// End Button Delete

// Filter Status
const filterStatus = document.querySelector("[filter-status]");
if (filterStatus) {
  const url = new URL(window.location.href);
  filterStatus.addEventListener("change", () => {
    const value = filterStatus.value;
    if (value) {
      url.searchParams.set("status", value);
    } else {
      url.searchParams.delete("status");
    }
    window.location.href = url.href;
  });

  const valueCur = url.searchParams.get("status");
  if (valueCur) {
    filterStatus.value = valueCur;
  }

  const resetPageNumber = url.searchParams.get("page");
  if (resetPageNumber) {
    url.searchParams.delete("page");
  }
}
// End Filter Status

//Filter CreateBy
const filterCreatedBy = document.querySelector("[filter-created-by]");
if (filterCreatedBy) {
  const url = new URL(window.location.href);
  filterCreatedBy.addEventListener("change", () => {
    const value = filterCreatedBy.value;
    if (value) {
      url.searchParams.set("createdBy", value);
    } else {
      url.searchParams.delete("createdBy");
    }
    window.location.href = url.href;
  });

  const valueCur = url.searchParams.get("createdBy");
  if (valueCur) {
    filterCreatedBy.value = valueCur;
  }

  const resetPageNumber = url.searchParams.get("page");
  if (resetPageNumber) {
    url.searchParams.delete("page");
  }
}
//End Filter CreateBy

//Filter Start Date
const filterStartDate = document.querySelector("[filter-start-date]");
if (filterStartDate) {
  const url = new URL(window.location.href);
  filterStartDate.addEventListener("change", () => {
    const value = filterStartDate.value;
    if (value) {
      url.searchParams.set("startDate", value);
    } else {
      url.searchParams.delete("startDate");
    }
    window.location.href = url.href;
  });

  const valueCur = url.searchParams.get("startDate");
  if (valueCur) {
    filterStartDate.value = valueCur;
  }

  const resetPageNumber = url.searchParams.get("page");
  if (resetPageNumber) {
    url.searchParams.delete("page");
  }
}
//End Filter Start Date

//Filter End Date
const filterEndDate = document.querySelector("[filter-end-date]");
if (filterEndDate) {
  const url = new URL(window.location.href);
  filterEndDate.addEventListener("change", () => {
    const value = filterEndDate.value;
    if (value) {
      url.searchParams.set("endDate", value);
    } else {
      url.searchParams.delete("endDate");
    }
    window.location.href = url.href;
  });

  const valueCur = url.searchParams.get("endDate");
  if (valueCur) {
    filterEndDate.value = valueCur;
  }

  const resetPageNumber = url.searchParams.get("page");
  if (resetPageNumber) {
    url.searchParams.delete("page");
  }
}
//End Filter End Date

//Filter Price
const filterPrice = document.querySelector("[filter-price]");
if (filterPrice) {
  const url = new URL(window.location.href);
  filterPrice.addEventListener("change", () => {
    const value = filterPrice.value;
    if (value) {
      url.searchParams.set("price", value);
    } else {
      url.searchParams.delete("price");
    }

    const priceValue = slider.noUiSlider.get();
    const minPrice = parseInt(priceValue[0]);
    const maxPrice = parseInt(priceValue[1]);

    if (minPrice && maxPrice) {
      url.searchParams.set("minPrice", minPrice);
      url.searchParams.set("maxPrice", maxPrice);
    } else {
      url.searchParams.delete("minPrice", minPrice);
      url.searchParams.delete("maxPrice", maxPrice);
    }

    window.location.href = url.href;
  });

  const valueCur = url.searchParams.get("price");
  if (valueCur) {
    filterPrice.value = valueCur;
  }

  const valCurMinPrice = url.searchParams.get("minPrice");
  const valCurMaxPrice = url.searchParams.get("maxPrice");
  if (valCurMinPrice && valCurMaxPrice) {
    slider.noUiSlider.set([Number(valCurMinPrice), Number(valCurMaxPrice)]);
  }

  const resetPageNumber = url.searchParams.get("page");
  if (resetPageNumber) {
    url.searchParams.delete("page");
  }
}
//End Filter Price

//Filter Category
const filterCategory = document.querySelector("[filter-category]");
if (filterCategory) {
  const url = new URL(window.location.href);
  filterCategory.addEventListener("change", () => {
    const value = filterCategory.value;
    if (value) {
      url.searchParams.set("category", value);
    } else {
      url.searchParams.delete("category");
    }
    window.location.href = url.href;
  });

  const valueCur = url.searchParams.get("category");
  if (valueCur) {
    filterCategory.value = valueCur;
  }

  const resetPageNumber = url.searchParams.get("page");
  if (resetPageNumber) {
    url.searchParams.delete("page");
  }
}
//End Filter Category

//Reset Filter
const filterReset = document.querySelector("[filter-reset]");
if (filterReset) {
  const url = new URL(window.location.href);
  filterReset.addEventListener("click", () => {
    url.search = "";
    window.location.href = url.href;
  });
}
//End Reset Filter

//Check All
const checkAll = document.querySelector("[check-all]");
if (checkAll) {
  checkAll.addEventListener("click", () => {
    const listCheckItem = document.querySelectorAll("[check-item]");
    listCheckItem.forEach((item) => {
      item.checked = checkAll.checked;
    });
  });
}
//End Check All

//Check Multi
const checkMulti = document.querySelector("[check-multi]");
if (checkMulti) {
  const api = checkMulti.getAttribute("data-api");
  const select = checkMulti.querySelector("select");
  const button = checkMulti.querySelector("button");

  button.addEventListener("click", () => {
    const option = select.value;
    const listCheckItem = document.querySelectorAll("[check-item]:checked");
    const ids = [];
    if (option && listCheckItem.length > 0) {
      listCheckItem.forEach((item) => {
        const id = item.getAttribute("check-item");
        ids.push(id);
      });

      const finalData = {
        option: option,
        ids: ids,
      };

      if (option == "destroy") {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            fetch(api, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(finalData),
            })
              .then((res) => res.json())
              .then((data) => {
                notify(data.code, data.message);
                window.location.reload();
              });
          }
        });
      } else {
        fetch(api, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        })
          .then((res) => res.json())
          .then((data) => {
            notify(data.code, data.message);
            window.location.reload();
          });
      }
    }
  });
}
//End Check Multi

//Searching Category
const Searching = document.querySelector("[search]");
if (Searching) {
  const url = new URL(window.location.href);

  Searching.addEventListener("keyup", (event) => {
    if (event.code == "Enter") {
      const value = Searching.value;
      if (value) {
        url.searchParams.set("search", value);
      } else {
        url.searchParams.delete("search");
      }
      window.location.href = url.href;
    }
  });

  const valueCur = url.searchParams.get("search");
  if (valueCur) {
    Searching.value = valueCur;
  }

  const resetPageNumber = url.searchParams.get("page");
  if (resetPageNumber) {
    url.searchParams.delete("page");
  }
}
//End Searching Category

//Partition
const pagination = document.querySelector("[pagination]");
if (pagination) {
  const url = new URL(window.location.href);
  pagination.addEventListener("change", () => {
    const value = pagination.value;
    if (value) {
      url.searchParams.set("page", value);
    } else {
      url.searchParams.delete("page");
    }
    window.location.href = url.href;
  });

  const valueCur = url.searchParams.get("page");
  if (valueCur) {
    pagination.value = valueCur;
  }
}
//End Partition

//Button Undo
const listBtnUndo = document.querySelectorAll("[btn-undo]");
if (listBtnUndo.length > 0) {
  listBtnUndo.forEach((btn) => {
    btn.addEventListener("click", () => {
      const dataApi = btn.getAttribute("data-api");
      fetch(dataApi, {
        method: "PATCH",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "error") {
            notyf.error(data.message);
          } else {
            notify(data.code, data.message);
            window.location.reload();
          }
        });
    });
  });
}
//End Button Undo

//Button Destroy
const listBtnDestroy = document.querySelectorAll("[btn-destroy]");
if (listBtnDestroy.length > 0) {
  listBtnDestroy.forEach((btn) => {
    btn.addEventListener("click", () => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const dataApi = btn.getAttribute("data-api");
          fetch(dataApi, {
            method: "DELETE",
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.code === "error") {
                notyf.error(data.message);
              } else {
                notify(data.code, data.message);
                window.location.reload();
              }
            });
        }
      });
    });
  });
}
//End Button Delete

//Role Edit
const settingRoleEditForm = document.querySelector("#setting-role-edit-form");
if (settingRoleEditForm) {
  const validation = new JustValidate("#setting-role-edit-form");

  validation
    .addField("#name", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập tên nhóm quyền!",
      },
    ])
    .onSuccess((event) => {
      const id = event.target.ID.value;
      const name = event.target.name.value;
      const description = event.target.description.value;
      const permissions = [];

      // permissions
      const listElementPermission = settingRoleEditForm.querySelectorAll(
        'input[name="permissions"]:checked'
      );
      listElementPermission.forEach((input) => {
        permissions.push(input.value);
      });
      // End permissions

      const finalData = {
        name: name,
        description: description,
        permissions: permissions,
      };

      const loader = document.getElementById("loader");
      loader.style.display = "block";
      const btnSummit = document.querySelector("#btnSummit");
      btnSummit.style.display = "none";

      fetch(`/${pathAdmin}/setting/role/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "error") {
            notyf.error(data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
          } else {
            notify(data.code, data.message);
            btnSummit.style.display = "inline";
            loader.style.display = "none";
            window.location.reload();
          }
        });
    });
}
//End Role Edit
