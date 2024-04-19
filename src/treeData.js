const data = {
    name: 'flare',
    children: [
      { name: 'DirtySprite', value: 8833 },
          { name: 'LineSprite', value: 1732,
            
          },
          { name: 'RectSprite', value: 3623 },
      
    ]
  };
  option = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'tree',
        id: 0,
        name: 'tree1',
        data: [data],
        top: '10%',
        left: '50%',
        bottom: '22%',
        right: '20%',
        symbolSize: 7,
        edgeShape: 'polyline',
        edgeForkPosition: '63%',
        initialTreeDepth: 3,
        lineStyle: {
          width: 2
        },
        label: {
          backgroundColor: '#fff',
          offset: [20,0],
          position: 'left',
          // height:22,
          width: 100,
          borderColor:'#ff8d0c',
          borderWidth: 1,
          formatter: val => {
            return [
              `{a|123}`,
              `{b|123}`,
              `{x|}`,
              `{b|123}`,
              ].join('\n')
          },
          rich: {
            a: {
              color: 'red',
              width: '100%',
              padding: 5,
              height:10,
              backgroundColor: '#ff8d0c',
              align:'left'
            },
            x: {
              // borderWidth: 1,
              // borderColor: 'black',
              width: '100%',
              height: 1,
              backgroundColor: 'black'
            },
            b:{
              height: 12,
              align: 'left',
            }
          },
          verticalAlign: 'middle',
          align: 'right'
        },
        leaves: {
          label: {
            offset: [-20,0],
            // backgroundColor: 'green',
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        emphasis: {
          focus: 'descendant'
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750
      },
      // {
      //   type: 'tree',
      //   id: 1,
      //   name: 'tree1',
      //   data: [data],
      //   top: '10%',
      //   left: '8%',
      //   bottom: '22%',
      //   right: '50%',
      //   symbolSize: 7,
      //   orient: 'RL',
      //   edgeShape: 'polyline',
      //   edgeForkPosition: '63%',
      //   initialTreeDepth: 3,
      //   lineStyle: {
      //     width: 2
      //   },
      //   label: {
      //     backgroundColor: 'blue',
      //     position: 'left',
      //     verticalAlign: 'middle',
      //     align: 'right'
      //   },
      //   leaves: {
      //     label: {
      //       position: 'right',
      //       backgroundColor: 'green',
      //       verticalAlign: 'middle',
      //       align: 'left'
      //     }
      //   },
      //   emphasis: {
      //     focus: 'descendant'
      //   },
      //   expandAndCollapse: true,
      //   animationDuration: 550,
      //   animationDurationUpdate: 750
      // },
    ]
  };