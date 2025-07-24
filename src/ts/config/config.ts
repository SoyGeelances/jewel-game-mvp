const buttons = { 

  retry: {
    eventName: 'retry',
    background: "retry_btn"
  },
  exitArcor: {
    eventName: 'exit',
    background: "exit_arcor_button"
  },
  goToShop: {
    eventName: 'gotoshop',
    background: "goto_shop_btn"
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
    background: "pause_btn"
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
      buttons.goToShop
    ],
    data: {}
  }
}

export {
  prompt,
  buttons
}


