import * as THREE from "three";

/**
 * @param {给定曲线的JSON} curve 
 * @param {拟合方法的JSON} solve 
 * @returns {传入曲线数据放回解算的代码点} points
 */
export const solveEllipsePoints = function (curve, solve) {

    //矩阵的后面再看
    const getDistance = function (e, c) {

        if (solve.method === 'equalChord')

            return Math.pow(getPointX(e, getY(e)) - getPointX(c, getY(c)), 2) + Math.pow(getPointY(e, getY(e)) - getPointY(c, getY(c)), 2) - Math.pow(solve.L, 2)

        let k = getSlope(e)
        let h = getPointY(c, getY(c)) - k * getPointX(c, getY(c))
        return ((Math.pow(k * getPointX(e, getY(e)) - getPointY(e, getY(e)) + h, 2)) / (Math.pow(k, 2) + 1)) - Math.pow(solve.L, 2)

    }
    const getSolution = function (a, b, c, d) {
        let k1 = a
        let k2 = k1 + b * d
        let k3, k4
        let bre = 0
        let time = 0

        while (1) {
            if (getDistance(k1, a) * getDistance(k2, a) < 0) {
                while (1) {

                    time++
                    k3 = 0.5 * (k1 + k2)

                    if (getDistance(k1, a) * getDistance(k3, a) < 0) {
                        k1 = k1
                        k2 = k3
                    } else if (getDistance(k3, a) === 0) {
                        break
                        // bre = 1
                    } else {
                        k1 = k3
                        k2 = k2
                    }
                    k4 = Math.abs(getDistance(k3, a))
                    if (k4 < c) {
                        bre = 1
                        break
                    }
                    if (time > 1000)
                        break
                }

            } else if (getDistance(k2, a) === 0) {
                k3 = k2
                bre = 1
            } else if (getDistance(k1, a) === 0) {
                k3 = k1
                bre = 1
            } else {
                k1 = k2
                k2 = k2 + b * d
            }
            if (bre === 1) {
                bre = 0
                break
            }
            if (time > 999)
                return k3
        }
        return k3

    }

    //a初始值，b方向，c精度判断,d初始判断步长
    const getSolutionK = function (a, b, c, d, t) {

        let k1 = a
        let k2 = k1 + b * d
        let k3, k4
        let bre = 0
        let kt = getSlope(a)

        while (1) {
            if (getDistanceK(k1, kt, t) * getDistanceK(k2, kt, t) < 0) {
                while (1) {
                    k3 = 0.5 * (k1 + k2)
                    if (getDistanceK(k1, kt, t) * getDistanceK(k3, kt, t) < 0) {
                        k1 = k1
                        k2 = k3
                    } else if (getDistanceK(k3, kt, t) === 0) {
                        break
                        // bre = 1
                    } else {
                        k1 = k3
                        k2 = k2
                    }
                    k4 = Math.abs(getDistanceK(k3, kt, t))
                    if (k4 < c) {
                        bre = 1
                        break
                    }
                }
            } else if (getDistanceK(k2, kt, t) === 0) {
                k3 = k2
                bre = 1
            } else if (getDistanceK(k1, kt, t) === 0) {
                k3 = k1
                bre = 1
            } else {
                k1 = k2
                k2 = k2 + b * d
            }
            if (bre === 1) {
                bre = 0
                break
            }
        }

        return k3
    }

    const getDistanceK = function (e, k, c) {

        return getY(e) - k * getX(e) - getY(c) + k * getX(c)

    }


    const getX = function (p) {

        return curve.a * Math.cos(p)

    }

    const getY = function (p) {

        return curve.b * Math.sin(p)

    }

    const getSlope = function (p) {

        return -(curve.b * Math.cos(p)) / (curve.a * Math.sin(p));

    }
    const getSlope2 = function (p) {

        return -(curve.a * curve.b * Math.sin(p) * Math.sin(p)) / (Math.pow(curve.a * Math.sin(p), 3));

    }
    const getPointX = function (c, e) {

        let lineK = getSlope(c)
        //let lineB = e - getX(c) * lineK;

        return getSlope2(c) > 0 ?
            getX(c) - disturb * Math.sin(Math.atan(lineK)) :
            getX(c) + disturb * Math.sin(Math.atan(lineK))

    }
    const getPointY = function (c, e) {

        let lineK = getSlope(c)
        //let lineB = e - getX(c) * lineK;

        return getSlope2(c) > 0 ?
            e + disturb * Math.cos(Math.atan(lineK)) :
            e - disturb * Math.cos(Math.atan(lineK))

    }

    const larm = function (t1, t2) {

        let x1 = getX(t2) - getX(t1)
        let y1 = getY(t2) - getY(t1)
        let x2 = getPointX(t2, getY(t2)) - getPointX(t1, getY(t1))
        let y2 = getPointY(t2, getY(t2)) - getPointY(t1, getY(t1))

        return x1 * x2 + y1 * y2 < 0 ? 1 : 0
    }

    const search = function () {

        let degree = Math.PI * curve.turnRound / 180
        //反旋转

        let res, min = 100000000

        for (let i = 0; i <= 24; i++) {

            let t = 2 * Math.PI * i / 24
            let temp = min

            let tempX = curve.a * Math.cos(t)
            let tempY = curve.b * Math.sin(t)

            let xt = tempX * Math.cos(degree) - tempY * Math.sin(degree)
            let yt = tempX * Math.sin(degree) + tempY * Math.cos(degree)
            //反移动
            xt += curve.x
            yt += curve.y

            min = Math.min(Math.pow(xt-solve.x,2)+Math.pow(yt-solve.y,2),min)
            if (min !== temp)
                res = t
        }
        return res

    }


    //最后放回的解算点
    let points = []
    //第一个点
    points.push(new THREE.Vector2(solve.x, solve.y))
    //扰动因子
    let disturb = 0
    if (solve.options === 'G41' && solve.direction === 'anit-clockwise')
        disturb = (solve.D + solve.e)
    else if (solve.options === 'G42' && solve.direction === 'clockwise')
        disturb = (solve.D + solve.e)
    else if (solve.options === 'G41' && solve.direction === 'clockwise')
        disturb = -(solve.D + solve.e)
    else if (solve.options === 'G42' && solve.direction === 'anit-clockwise')
        disturb = -(solve.D + solve.e)
    console.log('solve.options:' + solve.options + 'solve.direction:' + solve.direction)
    console.log('disturb:' + disturb)

    //数据
    //计算角度
    //返回-PI到PI
    let min = search()
    let max = min + 2 * Math.PI
    let msg = ''
    let degree = Math.PI * curve.turnRound / 180
    // let target = 5000

    //测测需不需要移动
    if (solve.direction === 'anit-clockwise') {

        let j1 = min
        //切入点
        points.push(new THREE.Vector2(getPointX(j1, getY(j1)), getPointY(j1, getY(j1))))

        while (1) {

            let ans = getSolution(j1, 1, 0.00001, 0.001)
            let r1 = j1

            j1 = solve.method === 'equalError' ? getSolutionK(ans, 1, 0.000001, 0.01, j1) : ans

            if (larm(r1, j1) === 1) {

                let tempX = getX(j1)
                let tempY = getY(j1)
                //旋转
                let xt = tempX * Math.cos(degree) - tempY * Math.sin(degree)
                let yt = tempX * Math.sin(degree) + tempY * Math.cos(degree)
                //移动
                xt += curve.x
                yt += curve.y

                msg += '警告:在（' + xt.toFixed(4) + '，' + yt.toFixed(4) + '）处发生过切\n'

            }
            if (j1 > max) {
                points.push(new THREE.Vector2(getPointX(max, getY(max)), getPointY(max, getY(max))))
                //alert('插补步骤为' + i + '步')
                break
            }
            points.push(new THREE.Vector2(getPointX(j1, getY(j1)), getPointY(j1, getY(j1))))
        }
    } else {

        let j1 = max
        points.push(new THREE.Vector2(getPointX(j1, getY(j1)), getPointY(j1, getY(j1))))

        while (1) {

            let ans = getSolution(j1, -1, 0.00001, 0.001)
            let r1 = j1

            j1 = solve.method === 'equalError' ? getSolutionK(ans, -1, 0.000001, 0.01, j1) : ans

            if (larm(r1, j1) === 1) {

                let tempX = getX(j1)
                let tempY = getY(j1)
                //旋转
                let xt = tempX * Math.cos(degree) - tempY * Math.sin(degree)
                let yt = tempX * Math.sin(degree) + tempY * Math.cos(degree)
                //移动
                xt += curve.x
                yt += curve.y

                msg += '警告:在（' + xt.toFixed(4) + '，' + yt.toFixed(4) + '）处发生过切\n'

            }
            if (j1 < min) {
                points.push(new THREE.Vector2(getPointX(min, getY(min)), getPointY(min, getY(min))))
                //console.log('插补步骤为' + i + '步')
                break
            }

            points.push(new THREE.Vector2(getPointX(j1, getY(j1)), getPointY(j1, getY(j1))))
        }
    }


    if (msg !== '') alert(msg)

    points.forEach(function (point, index, array) {
        if (index !== 0) {

            let tempX = point.x
            let tempY = point.y
            //旋转
            point.x = tempX * Math.cos(degree) - tempY * Math.sin(degree)
            point.y = tempX * Math.sin(degree) + tempY * Math.cos(degree)
            //移动
            point.x += curve.x
            point.y += curve.y
        }
    })

    points.push(new THREE.Vector2(solve.x, solve.y))
    //除去起点其他都乘上位移矩阵
    return points


}