const width = graph.get("width");
      const height = graph.get("height");
      const group = graph.get("group");
      group.resetMatrix();
      const bbox = group.getCanvasBBox();
 
      if (bbox.width === 0 || bbox.height === 0) return;
      const viewCenter = {
        x: width / 2,
        y: height / 2,
      };
 
      const groupCenter = {
        x: bbox.x + bbox.width / 2,
        y: bbox.y + bbox.height / 2,
      };
      graph.translate(viewCenter.x - groupCenter.x, viewCenter.y - groupCenter.y);
