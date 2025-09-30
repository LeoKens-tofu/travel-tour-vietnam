const buildTree = (categories, parentId = "") => {
  const tree = [];

  categories.forEach(item => {
    if (item.parent === parentId) {
      const child = buildTree(categories, item.id);

      tree.push({
        id: item.id,
        name: item.name,
        slug: item.slug,
        child: child
      });
    };
  });

  return tree;
}

module.exports = buildTree;