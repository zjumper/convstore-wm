var config = {
  STOMP_HOST: '127.0.0.1',
  STOMP_PORT: 61614,
  STOMP_USER: 'admin11',
  STOMP_PASSWD: 'admin',
  STOMP_TOPIC: '/topic/order',
  NOTICE_AUDIO: '/img/notice.wav',

  // product categories
  CATEGORIES: [
    {
      code: '01',
      label: '早中晚餐',
      subcat: [
        {
          code: '0100',
          label: '全部'
        },
        {
          code: '0101',
          label: '中式点心、粥'
        },
        {
          code: '0102',
          label: '饭团寿司'
        },
        {
          code: '0103',
          label: '三明治汉堡'
        },
        {
          code: '0104',
          label: '热餐'
        },
        {
          code: '0105',
          label: '便当饭、面食'
        },
        {
          code: '0106',
          label: '佐餐小菜'
        }
      ]
    },
    {
      code: '02',
      label: '哈哈镜',
      subcat: [
        {
          code: '0200',
          label: '全部'
        }
      ]
    },
    {
      code: '03',
      label: '烤肠炸品',
      subcat: [
        {
          code: '0300',
          label: '全部'
        }
      ]
    },
    {
      code: '04',
      label: '关东煮',
      subcat: [
        {
          code: '0400',
          label: '全部'
        }
      ]
    },
    {
      code: '05',
      label: '蔬果沙拉',
      subcat: [
        {
          code: '0500',
          label: '全部'
        }
      ]
    },
    {
      code: '06',
      label: '面包甜点',
      subcat: [
        {
          code: '0600',
          label: '全部'
        },
        {
          code: '0601',
          label: '蛋糕甜点'
        },
        {
          code: '0602',
          label: '常温面包'
        }
      ]
    },
    {
      code: '07',
      label: '奶制品',
      subcat: [
        {
          code: '0700',
          label: '全部'
        },
        {
          code: '0701',
          label: '鲜奶'
        },
        {
          code: '0702',
          label: '酸奶'
        },
        {
          code: '0703',
          label: '乳饮料'
        }
      ]
    },
    {
      code: '08',
      label: '饮料',
      subcat: [
        {
          code: '0800',
          label: '全部'
        },
        {
          code: '0801',
          label: '饮用水'
        },
        {
          code: '0802',
          label: '咖啡'
        },
        {
          code: '0803',
          label: '茶'
        },
        {
          code: '0804',
          label: '低温饮料'
        },
        {
          code: '0805',
          label: '碳酸饮料'
        },
        {
          code: '0806',
          label: '常温果汁'
        },
        {
          code: '0807',
          label: '运动功能饮料'
        },
        {
          code: '0808',
          label: '冲调饮品'
        }
      ]
    },
    {
      code: '09',
      label: '冰淇淋',
      subcat: [
        {
          code: '0900',
          label: '全部'
        }
      ]
    },
    {
      code: '10',
      label: '口香糖',
      subcat: [
        {
          code: '1000',
          label: '全部'
        }
      ]
    },
    {
      code: '11',
      label: '润喉糖',
      subcat: [
        {
          code: '1100',
          label: '全部'
        }
      ]
    },
    {
      code: '12',
      label: '休闲食品',
      subcat: [
        {
          code: '1200',
          label: '全部'
        },
        {
          code: '1201',
          label: '巧克力'
        },
        {
          code: '1202',
          label: '果脯蜜饯'
        },
        {
          code: '1203',
          label: '肉脯'
        },
        {
          code: '1204',
          label: '糖果'
        },
        {
          code: '1205',
          label: '饼干点心'
        },
        {
          code: '1206',
          label: '膨化食品'
        },
        {
          code: '1207',
          label: '瓜子花生'
        },
        {
          code: '1208',
          label: '健康坚果'
        },
        {
          code: '1209',
          label: '豆干制品'
        }
      ]
    },
    {
      code: '13',
      label: '方便面',
      subcat: [
        {
          code: '1300',
          label: '全部'
        }
      ]
    },
    {
      code: '14',
      label: '酒类',
      subcat: [
        {
          code: '1400',
          label: '全部'
        },
        {
          code: '1401',
          label: '洋酒'
        },
        {
          code: '1402',
          label: '啤酒'
        },
        {
          code: '1403',
          label: '预调酒'
        },
        {
          code: '1404',
          label: '传统酒'
        }
      ]
    },
    {
      code: '15',
      label: '粮油调味',
      subcat: [
        {
          code: '1500',
          label: '全部'
        },
        {
          code: '1501',
          label: '调味品'
        },
        {
          code: '1502',
          label: '米面粮油'
        }
      ]
    },
    {
      code: '16',
      label: '玩具',
      subcat: [
        {
          code: '1600',
          label: '全部'
        }
      ]
    },
    {
      code: '17',
      label: '手机配件',
      subcat: [
        {
          code: '1700',
          label: '全部'
        }
      ]
    },
    {
      code: '18',
      label: '内衣袜子',
      subcat: [
        {
          code: '1800',
          label: '全部'
        }
      ]
    },
    {
      code: '19',
      label: '日用百货',
      subcat: [
        {
          code: '1900',
          label: '全部'
        },
        {
          code: '1901',
          label: '个护清洁、面膜'
        },
        {
          code: '1902',
          label: '女士卫生用品'
        },
        {
          code: '1903',
          label: '计生用品'
        },
        {
          code: '1904',
          label: '纸巾'
        },
        {
          code: '1905',
          label: '文具'
        }
      ]
    }
  ]
};
