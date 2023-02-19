Page({
	build() {
        var isStart = false;
        // hmUI.setScrollView(true, px(480), 2, true)
        const time = hmSensor.createSensor(hmSensor.id.TIME);
        const vibrate = hmSensor.createSensor(hmSensor.id.VIBRATE);
        time.is24Hour = true;
        var sumTime = hmFS.SysProGetInt64('sumTime');

        if (hmFS.SysProGetInt('date') != time.day)
        {
            hmFS.SysProSetInt64('sumTime',0)
            hmFS.SysProSetInt('date',time.day)
        }
        hmFS.SysProSetInt('date',time.day)

        // const debug = hmUI.createWidget(hmUI.widget.TEXT, {
        //     x: 0,
        //     y: 300,
        //     w: 192,
        //     h: 120,
        //     color: 0x1E90FF,
        //     text_size: 16,
        //     align_h: hmUI.align.CENTER_H,
        //     align_v: hmUI.align.CENTER_V,
        //     text_style: hmUI.text_style.NONE,
        //     text: ""
        // })

        // function Debug(txt)
        // {
        //     debug.setProperty(hmUI.prop.MORE, {
        //         text:txt
        //       })
        // }

        function format(data)
        {
            var x,y,z;
            
            data *= 0.001;      
            
            x = Math.floor((data/3600).toFixed(2));
            y = Math.floor(((data/60)%60).toFixed(2));
            z = Math.floor((data%60).toFixed(2));
            return `${x}小时${y}分${z}秒`
        }

        function start()
        {
            vibrate.stop()
            vibrate.scene = 24
            vibrate.start()
            currentData.setProperty(hmUI.prop.MORE, {
                text: ""
              })
            sumData.setProperty(hmUI.prop.MORE, {
                text: ""
              })
            hmFS.SysProSetBool('isStart',true);
            MainButton.setProperty(hmUI.prop.MORE, {
                x:(192-150)*0.5,
                y: (480-150)*0.5,
                w: -1,
                h: -1,
                normal_src: 'end.png',
                press_src: 'end.png',
            })
            hmFS.SysProSetInt64('startTime', time.utc)
            
        }
        
        
        function end()
        {
            vibrate.stop()
            vibrate.scene = 24
            vibrate.start()
            hmFS.SysProSetBool('isStart',false);
                    MainButton.setProperty(hmUI.prop.MORE, {
                        x:(192-150)*0.5,
                        y: (480-150)*0.5,
                        w: -1,
                        h: -1,
                        normal_src: 'start.png',
                        press_src: 'start.png',
                    })

            hmFS.SysProSetInt64("sumTime",hmFS.SysProGetInt64('sumTime') + time.utc - hmFS.SysProGetInt64('startTime'));
            sumTime = hmFS.SysProGetInt64("sumTime");
            format(sumTime);
            sumData.setProperty(hmUI.prop.MORE, {
                text: `今日总计\n${format(sumTime)}`
              })

            currentData.setProperty(hmUI.prop.MORE, {
              text: `本次用时\n${format(time.utc - hmFS.SysProGetInt64('startTime'))}`
            })
            
        }

        





        // const page1 = hmUI.createWidget(hmUI.widget.FILL_RECT, {
        //     x: 0,
        //     y: 0,
        //     w: 192,
        //     h: 480,
        //     radius: 90,
        //     color: 0xfc6950
        //   })

        const sumData = hmUI.createWidget(hmUI.widget.TEXT, {
            x: 0,
            y: 90,
            w: 192,
            h: 60,
            color: 0x1E90FF,
            text_size: 22,
            align_h: hmUI.align.CENTER_H,
            align_v: hmUI.align.CENTER_V,
            text_style: hmUI.text_style.NONE,
            text: `今日总计\n${format(sumTime)}`
        })
        const currentData = hmUI.createWidget(hmUI.widget.TEXT, {
            x: 0,
            y: 330,
            w: 192,
            h: 60,
            color: 0x1E90FF,
            text_size: 22,
            align_h: hmUI.align.CENTER_H,
            align_v: hmUI.align.CENTER_V,
            text_style: hmUI.text_style.NONE,
            text: ``
        })


        



        if (hmFS.SysProGetBool('isStart')==undefined)
        {
            hmFS.SysProSetBool('isStart',false);
        }
          const MainButton = hmUI.createWidget(hmUI.widget.BUTTON, {
            x: (192-150)*0.5,
            y: (480-150)*0.5,
            w: -1,
            h: -1,
            normal_src: 'start.png',
            press_src: 'start.png',
            click_func: () => {
                if(hmFS.SysProGetBool('isStart'))
                {                    
                    end() 
                }
                else
                {
                    start();
                }
                
            }
          })
          if (hmFS.SysProGetBool('isStart')==true)
        {
                    MainButton.setProperty(hmUI.prop.MORE, {
                        x: (192-150)*0.5,
                        y: (480-150)*0.5,
                        w: -1,
                        h: -1,
                        normal_src: 'end.png',
                        press_src: 'end.png',
                    })
        }
        // const clearButton = hmUI.createWidget(hmUI.widget.BUTTON, {
        //     x: (192-50)/2,
        //     y: 420,
        //     w: 50,
        //     h: 30,
        //     radius: 10,
        //     normal_color: 0x1E90FF,
        //     press_color: 0x1E90FF,
        //     text: "清除",
        //     text_size: 18,
        //     click_func: () => {
        //         hmFS.SysProSetInt64('sumTime',0);
        //         sumData.setProperty(hmUI.prop.MORE, {
        //             text: `今日总计\n${format(0)}`
        //           });
        //         currentData.setProperty(hmUI.prop.MORE, {
        //           text: ""
        //         });     
        //     }
        //   })
	},
    onDestroy() {
        vibrate && vibrate.stop()
      }
})
