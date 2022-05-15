//生成代码的函数 通过循环遍历点让后插入

//tool 有刀具速度 起点坐标 create 有编程方式和转动速度
export const generator = function (tool, create, points) {

    //if(points === null) return ""

    let txt = "%O001" + '\t\n'
    let index = 1
    if (create.value === 'G90') {

        txt += 'N' + index++ + '0 G92 G17 X' + create.x + ' Y' + create.y + ' LF\t\n'
        txt += 'N' + index++ + '0 M03 M08 F' + tool.v + ' S' + create.roundSpeed + ' LF\t\n'


        txt += 'N' + index++ + '0 G90 G00 X' + points[0].x.toFixed(4) + ' Y' + points[0].y.toFixed(4) + ' LF\t\n'
        txt += 'N' + index++ + '0 G18 G01 Z-2.000 LF\t\n'

        let x0, y0
        points.forEach(function (value, i, array) {

            let x1 = value.x.toFixed(4)
            let y1 = value.y.toFixed(4)

            if (i !== 0 && x1 !== x0 && y1 !== y0) {
                txt += 'N' + index++ + '0 G01 X' + x1 + ' Y' + y1 + ' LF\t\n'
                x0 = x1
                y0 = y1
            }
        })
        txt += 'N' + index++ + '0 G18 G01 Z30.0000 LF\t\n'
        txt += 'N' + index++ + '0 G00 X' + points[0].x.toFixed(4) + ' Y' + points[0].y.toFixed(4) + ' LF\t\n'
        txt += 'N' + index++ + '0 M05 M09' + ' LF\t\n'
        txt += 'N' + index++ + '0 M30' + ' LF\t\n'

        return txt
    }

    if (create.value === 'G91') {

        txt += 'N' + index++ + '0 G91 G00 X' + points[0].x.toFixed(4) + ' Y' + points[0].y.toFixed(4) + ' LF\t\n'

        txt += 'N' + index++ + '0 M03 M08 F' + tool.v + ' S' + create.roundSpeed + ' LF\t\n'

        txt += 'N' + index++ + '0 G18 G01 Z-2.000 LF\t\n'

        let x0 = points[0].x.toFixed(4)
        let y0 = points[0].y.toFixed(4)

        points.forEach(function (value, i, array) {

            let x1 = value.x.toFixed(4)
            let y1 = value.y.toFixed(4)

            if (i !== 0 && x1 !== x0 && y1 !== y0) {
                txt += 'N' + index++ + '0 G01 X' + (x1 - x0).toFixed(4) + ' Y' + (y1 - y0).toFixed(4) + ' LF\t\n'
                x0 = x1
                y0 = y1
            }
        })

        txt += 'N' + index++ + '0 G18 G01 Z30.0000 LF\t\n'
        txt += 'N' + index++ + '0 G00 X' + (points[0].x.toFixed(4) - points[points.length - 1].x.toFixed(4)).toFixed(4) + ' Y' + (points[0].y.toFixed(4) - points[points.length - 1].y.toFixed(4)).toFixed(4) + ' LF\t\n'
        txt += 'N' + index++ + '0 M05 M09' + ' LF\t\n'
        txt += 'N' + index++ + '0 M30' + ' LF\t\n'

        return txt
    }
}