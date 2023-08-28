import React, { useEffect, useRef, useState } from "react"
import * as lanLiveChat from "@/utils/lan-live-chat"
import styles from "./style.module.scss"
import { throttle } from "@/composable"



type DanmuMsg = { msg: string; color: string }

// 生成随机颜色的函数
function getRandomColor() {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    const randomNum = Math.floor(Math.random() * 5) + 10
    color += letters[randomNum]
  }
  return color
}

export default function Chat() {
  /* useState定义 */
  const [danmuMsg, setDanmuMsg] = useState<DanmuMsg[]>([])
  const [viewMsg, setViewMsg] = useState<number>(0)
  const [usedColors, setUsedColors] = useState<string[]>([])
  const [shouldAutoScroll, setShouldAutoScroll] = useState<boolean>(true)

  /* 变量定义 */
  const msgRef = useRef(null)

  const maxLenth = 100

  let storageMsgs: any[] = []
  let timer: NodeJS.Timeout

  /* 方法定义 */
  function toSetDanmuMsg() {
    let randomColor: string

    storageMsgs.forEach((msg, index) => {
      timer = setTimeout(() => {
        setUsedColors((prevColor) => {
          do {
            randomColor = getRandomColor()
          } while (prevColor.includes(randomColor))
          if (prevColor.length > maxLenth) {
            prevColor = []
          }
          setDanmuMsg((prevDanmuMsg) => {
            return [...prevDanmuMsg, { msg: msg, color: randomColor }]
          })

          return [...prevColor, randomColor]
        })
      }, (index + 1) * 100)
    })
    storageMsgs = []
  }

  const throttledToSetDanmuMsg = (msg: any) => {
    storageMsgs.push(msg)

    return throttle(toSetDanmuMsg, 5000, {
      isFirstExecution: true,
    })
  }

  /* useEffect定义 */
  useEffect(() => {
    // const room_id = 5344371; // 测试
    const room_id = 5050 // 大直播间

    new lanLiveChat.BClient(room_id)

    //认证成功事件
    lanLiveChat.Bon("Certify_Success", function (e: any) {
      const data = e
      if (data.code == 0) {
        console.log("Certify_Success")
      }
    })

    //进入直播间或关注直播间事件
    lanLiveChat.Bon("INTERACT_WORD", function (e: any) {
      const data = e
      const uname = data.data.uname
      const timedata = new Date(data.data.timestamp * 1000)
      const time =
        timedata.toLocaleDateString() +
        " " +
        timedata.toTimeString().split(" ")[0]

      let msg: string
      if (data.data.msg_type == 2) {
        msg = time + " " + uname + " 关注直播间"
      } else {
        msg = time + " " + uname + " 进入直播间"
      }

      throttledToSetDanmuMsg(msg)()
    })

    // 人气值刷新事件
    lanLiveChat.Bon("VIEW", function (e: any) {
      const data = e
      console.log("view:", data)

      setViewMsg(data)
    })

    //弹幕事件
    lanLiveChat.Bon("DANMU_MSG", function (e: any) {
      const data = e
      const uname = data.info[2][1]
      const timedata = new Date(data.info[9].ts * 1000)
      const time =
        timedata.toLocaleDateString() +
        " " +
        timedata.toTimeString().split(" ")[0]
      const text = data.info[1]
      // const msg = data.cmd + " " + time + " " + uname + " :" + text;
      const msg = time + " " + uname + " :" + text

      throttledToSetDanmuMsg(msg)()
    })
  }, [])

  useEffect(() => {
    const newItem = msgRef.current.lastChild
    const scrollTop = msgRef.current.scrollTop
    const clientHeight = msgRef.current.clientHeight
    const scrollHeight = msgRef.current.scrollHeight

    const maxHiddenHeight = scrollHeight - clientHeight
    const tolerateHeigth = clientHeight * 0.2
    // console.log("scrollTop", scrollTop);
    // console.log("maxHiddenHeight", maxHiddenHeight);
    // console.log("tolerateHeigth", tolerateHeigth);
    // console.log(msgRef);

    if (newItem) {
      // 使得不正常div恢复正常
      if (document.visibilityState === "hidden") {
        msgRef.current.childNodes.forEach((item: any) => {
          item.style.opacity = 1
        })
      }

      if (scrollTop + tolerateHeigth < maxHiddenHeight) {
        // noting
      } else {
        msgRef.current.scrollTo({
          left: 0, // x坐标
          top: scrollHeight,
          behavior: "smooth", // 可选值：smooth、instant、auto
        })
      }

      setTimeout(() => {
        newItem.style.opacity = 1
      }, 1000)
    }

    if (danmuMsg.length >= maxLenth) {
      setDanmuMsg((prevDanmuMsg) => {
        prevDanmuMsg.shift()
        return prevDanmuMsg
      })
    }

  }, [danmuMsg])

  return (
    <>
      <div className={styles.chatContainer}>
        <div className={styles.viewContainer}>{viewMsg}</div>
        <div className={styles.danmuContainer} ref={msgRef}>
          {danmuMsg.map((item, index) => {
            return (
              <div
                className={styles.danmuMsg}
                style={{ backgroundColor: item.color }}
                key={index}
              >
                {item.msg}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
