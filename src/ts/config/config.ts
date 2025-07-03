const buttons = { 

  retry: {
    eventName: 'retry',
    background: "retry_button"
  },
  exitArcor: {
    eventName: 'exit',
    background: "exit_saphirus_button"
  },
  back: {
    eventName: 'back',
    background: "tevas_button"
  },
  copy: {
    eventName: 'copy',
    background: "copy_coupon_button"
  },
  close: {
    eventName: 'close',
    background: "close_button"
  },
  copied: {
    eventName: 'copy',
    background: "copied_coupon_button"
  }
}

const prompt = {

  retry: {
    title: "seguiintentando_title",
    message: "retry_message",
    actions: [
      buttons.retry,
      buttons.exitArcor
    ],
    data: {}
  },
  narrowly: {
    title: "porpoco_title",
    message: "retry_message",
    actions: [
      buttons.retry,
      buttons.exitArcor
    ],
    data: {}
  },
  win: {
    title: "win_title",
    message: "win_message",
    actions: [
      buttons.copy,
      buttons.exitArcor
    ],
    data: {}
  },
  leaving: {
    title: "tevas_title",
    message:"tevas_message",
    actions: [
      buttons.back,
      buttons.exitArcor
    ],
    data: {}
  }
}

export {
  prompt,
  buttons
}


