import * as THREE from "three";
export class ObjectFactory {

    constructor(scene) {
        this.scene = scene
        //计算得到的点
        this.outputPoints = []
        this.solution = new Solution()
    }

    //接受Curve表单发过来的Json数据生成曲线
    create(data) {
        //打印接受到Json数据
        console.log(data)
        this.deserializationCurve(data)

        //注意Json数据的类型，是序列化的
        if (data.value === 'ellipse')
            return this.drawEllipse(data.a, data.b, data.x, data.y, data.turnRound)
    }
    //接受Method表单发过来的Json数据拟合曲线
    solve(data, factor) {

        console.log(factor)
        let output
        this.deserializationCurve(data)
        this.deserializationSolve(factor)

        if (data.value === 'ellipse') {
            //得到解算出来的点
            this.outputPoints = this.solution.solveEllipse(data, factor)

            // let curve = new THREE.CatmullRomCurve3(this.outputCurve)
            // this.outputCurve = curve.getPoints( 200 )

            output = this.draw(this.outputPoints)

            this.scene.add(output)
        }
        return output
    }


    //要得到运动的轨迹 其实是一堆直线 要等距离划分
    //解算出来的点要划分
    getSimulationMovePoints() {
        // let curve = new THREE.CatmullRomCurve3(this.outputCurve)
        // this.outputCurve = curve.getPoints( 200 )
        //把直线先分割 然后组合放回去
        // 创建组合曲线对象CurvePath
        let curvePath = new THREE.CurvePath()
        //复制计算的曲线
        let input = this.outputPoints
        for(let i = 0;i < input.length-1;i++){
            let line = new THREE.LineCurve(new THREE.Vector2(input[i].x, input[i].y, 0), new THREE.Vector2(input[i+1].x, input[i+1].y, 0));
            curvePath.curves.push(line)
        }
        let output = curvePath.getSpacedPoints(input.length-1)
        return output
    }
    //得到G代码的轨迹 即计算的轨迹
    getCodeMovePoints() {
        return this.outputPoints
    }

    deserializationCurve(data) {

        data.x = parseFloat(data.x)
        data.y = parseFloat(data.y)
        data.a = parseFloat(data.a)
        data.b = parseFloat(data.b)
        data.k = parseFloat(data.k)
        data.turnRound = parseFloat(data.turnRound)
        data.begin = parseFloat(data.begin)
        data.end = parseFloat(data.end)
        data.near = parseFloat(data.near)
        data.far = parseFloat(data.far)
        data.h = parseFloat(data.h)
        data.baseRadius = parseFloat(data.near)

        return data

    }

    deserializationSolve(data) {

        data.L = parseFloat(data.L)
        data.D = parseFloat(data.D)
        data.e = parseFloat(data.e)
        data.x = parseFloat(data.x)
        data.y = parseFloat(data.y)
        data.v = parseFloat(data.v)

        return data

    }

    createTool(data) {

        data.D = parseFloat(data.D)
        data.beginX = parseFloat(data.beginX)
        data.beginY = parseFloat(data.beginY)

        let geometry = new THREE.CylinderGeometry(data.D, data.D, 20, data.D * 100);
        let material = new THREE.MeshBasicMaterial({ color: 0x808080 });
        let cylinder = new THREE.Mesh(geometry, material);
        cylinder.setRotationFromEuler(new THREE.Euler(1.57, 0, 0, "XYZ"));
        cylinder.position.x = data.beginX
        cylinder.position.y = data.beginY
        this.scene.add(cylinder);
        return cylinder

    }

    //用线的方式划分
    draw(input) {

        let material = new THREE.LineBasicMaterial({ color: 0x0099FF });
        let geometry = new THREE.BufferGeometry().setFromPoints(input);
        //放回线的实体
        let line = new THREE.Line(geometry, material);
        return line
    }

    drawEllipse(a, b, x, y, turnRound) {

        let curve = new THREE.EllipseCurve(
            x, y,            // ax, aY
            a, b,           // xRadius, yRadius
            0, 2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            Math.PI * turnRound * 2 / 360                 // aRotation
        );

        let points = curve.getPoints(500);

        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        let material = new THREE.LineBasicMaterial({ color: 0xff0000 });

        // Create the final object to add to the scene
        let ellipse = new THREE.Line(geometry, material);
        this.scene.add(ellipse)
        return ellipse
    }


    // 不能重载？？？
    // //测试用例，创建一个椭圆
    // drawEllipse() {
    //     const curve = new THREE.EllipseCurve(
    //         1,  1,            // ax, aY
    //         4, 2,           // xRadius, yRadius
    //         0,  2 * Math.PI,  // aStartAngle, aEndAngle
    //         false,            // aClockwise
    //         0.5                 // aRotation
    //     );

    //     const points = curve.getPoints( 500 );
    //     const geometry = new THREE.BufferGeometry().setFromPoints( points );

    //     const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

    //     // Create the final object to add to the scene
    //     const ellipse = new THREE.Line( geometry, material );
    //     this.scene.add(ellipse)
    // }


}
export class PointsFactory {


    constructor() {

    }

    ellipse(a, b, x, y, count, radiusCompenssation, flag) {

        //存放点的数组
        let output = []

        for (let i = 0; i <= count; i++) {

            let t = 2 * Math.PI * i / count

            //直接push到末尾的，这个是容器 不像c要先声明边界
            //new THREE.Vector2 就是坐标
            output.push(new THREE.Vector2((a + radiusCompenssation) * Math.cos(t) + x,
                (b + radiusCompenssation) * Math.sin(t)) + y)
        }
        //三元运算符 判断正转和反转
        return flag == 0 ? output : output.reverse()
    }

}
export class Solution {

    constructor() {

    }


    solveEllipse(data, factor) {


        //扰动因子
        let disturb = 0

        if (factor.options === 'G41' && factor.direction === 'clockwise')
            disturb = (factor.D + factor.e)
        else if (factor.options === 'G42' && factor.direction === 'anit-clockwise')
            disturb = (factor.D + factor.e)
        else if (factor.options === 'G41' && factor.direction === 'anit-clockwise')
            disturb = -(factor.D + factor.e)
        else if (factor.options === 'G42' && factor.direction === 'clockwise')
            disturb = -(factor.D + factor.e)
        else
            disturb = factor.e

        console.log(disturb)

        let curve = new THREE.EllipseCurve(
            data.x, data.y,            // ax, aY
            data.a + disturb, data.b + disturb,           // xRadius, yRadius
            0, 2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            Math.PI * data.turnRound * 2 / 360                 // aRotation
        );

        let nums = (data.a + data.b) * 10
        let points = factor.direction === 'clockwise' ? curve.getPoints(nums) : curve.getPoints(nums).reverse();

        if (factor.method === 'equalError') {
            return this.equalError(points, factor.L, factor.x, factor.y)
        } else if (factor.method === 'equalChord') {
            return this.equalChord(points, factor.L, factor.x, factor.y)
        }
        return null
    }





    equalError(input, error, beginX, beginY) {

        if (typeof input == "undefined" || !input || input.length <= 0 || typeof input[0].x == "undefined")
            return

        let points = []
        let curr = 0, x0 = beginX, y0 = beginY
        let x1, y1, A, B, C
        let isSameFirst = beginX === input[0].x && beginY === input[0].y
        while (curr < input.length - 1) {
            //下一個點
            x1 = input[curr + 1].x
            y1 = input[curr + 1].y

            A = y0 - y1
            B = -(x0 - x1)
            C = -(y0 - y1) * x1 + (x0 - x1) * y1


            //等误差判断条件
            while (curr < input.length - 1 && error > Math.abs((A * input[curr].x + B * input[curr].y + C) / Math.sqrt(A * A + B * B))
            ) {
                curr++
            }
            points.push(new THREE.Vector3(x0, y0, 0))

            //切入点不是第一个点要存
            if (!isSameFirst) {
                isSameFirst = true
                points.push(new THREE.Vector3(input[0].x, input[0].y, 0))
            }

            points.push(new THREE.Vector3(input[curr].x, input[curr].y, 0))
            x0 = input[curr].x
            y0 = input[curr].y
        }
        //最后一個點
        points.push(new THREE.Vector3(x0, y0, 0))
        points.push(new THREE.Vector3(input[input.length - 1].x, input[input.length - 1].y, 0))
        return points
    }





    // ////////////////////////////////////////////////////////////////////////////
    // equalError(a, b, beginX, beginY, radiusCompenssation, error) {

    //     let count = 451
    //     let input = []
    //     let points = []

    //     for (let i = 0; i <= count; i++) {

    //         let num = 2 * Math.PI * i / count
    //         input.push(new THREE.Vector2(a * Math.cos(num), b * Math.sin(num)))

    //     }
    //     //return input
    //     let curr = 0,x0 = beginX, y0 = beginY
    //     let x1, y1, A, B, C

    //     while (curr  < input.length - 1) {
    //         //下一個點
    //         x1 = input[curr + 1].x
    //         y1 = input[curr + 1].y

    //         A = y0 - y1
    //         B = -(x0 - x1)
    //         C = -(y0 - y1) * x1 + (x0 - x1) * y1
    //         //等误差判断条件
    //         while (curr < input.length - 1 && error > Math.abs((A * input[curr].x + B * input[curr].y + C) / Math.sqrt(A * A + B * B))
    //             ) {
    //             curr++
    //         }
    //         points.push(new THREE.Vector3(x0, y0, 0))
    //         points.push(new THREE.Vector3(input[curr].x, input[curr].y, 0))
    //         x0 = input[curr].x
    //         y0 = input[curr].y
    //     }
    //     //最后一個點
    //     points.push(new THREE.Vector3(x0, y0, 0))
    //     points.push(new THREE.Vector3(input[input.length - 1].x, input[input.length - 1].y, 0))
    //     return points
    // }




    methodDemo(a, b, beginX, beginY, radiusCompenssation, error) {

        let count = 100
        let input = []
        let points = []

        for (let i = 0; i <= count; i++) {

            let num = 2 * Math.PI * i / count
            input.push(new THREE.Vector2(a * Math.cos(num), b * Math.sin(num)))

        }
        //return input
        let prev = 0, curr = 1, next = 2
        let x0 = beginX, y0 = beginY
        let x1, y1, A, B, C

        while (1) {

            x1 = input[next].x
            y1 = input[next].y
            A = y0 - y1
            B = -(x0 - x1)
            C = -(y0 - y1) * x1 + (x0 - x1) * y1

            while (1) {
                let delta = Math.abs((A * input[curr].x + B * input[curr].y + C) / Math.sqrt(A * A + B * B))
                if (delta < error)
                    curr++
                else {
                    points.push(new THREE.Vector3(x0, y0, 0))
                    points.push(new THREE.Vector3(input[curr].x, input[curr].y, 0))
                    x0 = input[curr].x
                    y0 = input[curr].y
                    prev++
                    break
                }
                if (curr > input.length - 1) {
                    points.push(new THREE.Vector3(x0, y0, 0))
                    points.push(new THREE.Vector3(input[input.length - 1].x, input[input.length - 1].y, 0))
                    return points
                }
            }
            next = curr + 1
        }
    }
}
