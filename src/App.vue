<template>
  <div id="app">
    <div class="card">
      <div class="special__field container">
        <div
          class="card__slot"
          v-for="(slot, i) in specialSlot"
          :key="i"
          :style="Object.assign({}, getCenterMargin(i), {
            backgroundImage: `url(./${slot.type}_index.png)`
          })"
          :class="{
            'slot__end': !!slot.type,
            'slot__temp': slot.number === TEMP_SLOT
          }"
          @dragover.prevent
          @drop="drop(slot, activePoker)"
        >
          <nest-card
            v-if="slot.next"
            :card="slot.next"></nest-card>
        </div>
      </div>
      <div class="card__fields container">
        <div class="card__field"
          v-for="(cards, i) in game"
          :key="i"
          @dragover.prevent
          @drop="drop(cards, activePoker)"
          :style="getCenterMargin(i)"
        >
          <ul class="card__slot">
            <li>
              <nest-card
                v-if="cards.next"
                :card="cards.next"
                >
              </nest-card>
            </li>
          </ul>
        </div>
      </div>
      <div class="bottom container">
        <button class="btn mr-20" @click="initGame">Reset</button>
        <button class="btn" @click="goPrevious"><img class="icon" src="../public/previous_icon.png">Previous</button>
        <div class="time">
          <span class="mr-20">Time: </span>
          <span>{{ time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NestCard from './components/NestCard.vue'
const TEMP_SLOT = 5566
const TYPE_MAPPING = ['club', 'diamond', 'spade', 'heart']

export default {
  name: 'app',
  components: {
    NestCard
  },
  data () {
    return {
      isWin: false,
      timer: null,
      counter: 0,
      game: [],
      specialSlot: [],
      TEMP_SLOT,
      gameStep: []
    }
  },
  computed: {
    activePoker () {
      return this.$store.state.activePoker
    },
    time () {
      let time = this.counter * 1000
      let hours = Math.floor(time / 1000 / 60 / 60)
      time = time - hours * 1000 * 60 * 60
      let minutes = Math.floor(time / 1000 / 60)
      time = time - minutes * 1000 * 60
      let sec = time / 1000
      return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${sec < 10 ? '0' : ''}${sec}`
    }
  },
  methods: {
    goPrevious () {
      if (this.gameStep.length <= 0) return
      const [previousPoker, poker] = this.gameStep.pop()
      this.drop(previousPoker, poker, true)
    },
    getCenterMargin (i) {
      return {
        marginRight: i === 3 ? `75px` : 0
      }
    },
    cardToNumbers (card) {
      let next = []
      if (card.next) {
        next = this.cardToNumbers(card.next)
      }
      return [card.number, ...next]
    },
    canLastNumberConnectUp (lastNumber, connNumber) {
      const lastType = Math.floor(lastNumber / 13)
      const connType = Math.floor(connNumber / 13)
      const lastCardNumber = lastNumber % 13 + 1
      const connCardNumber = connNumber % 13 + 1
      return (Math.abs(connType - lastType) % 2 === 1 && lastCardNumber - connCardNumber === 1) || lastNumber === 999
    },
    isSequence (card, upperCard = null) {
      let number = card.number % 13 + 1
      let upperNumber = upperCard ? upperCard.number % 13 + 1 : number + 1
      let diff = upperNumber - number
      if (!card.next) return diff === 1 // 最後一筆資料回傳
      if (diff !== 1) return false // 如果已經不照順序就直接回 false 不要繼續找了
      return upperNumber - number === 1 && this.isSequence(card.next, card)
    },

    drop (cards, poker, previousMode = false) {
      const fieldLastCard = this.findLastCard(cards)

      const previousPoker = poker.previous
      poker.finish = false
      if (!previousMode) {
        if (cards.number === TEMP_SLOT) {
          this.dropOnTemp(cards, poker)
          return
        }
        if (cards.type) {
          this.dropOnEnd(cards, poker)
          return
        }
        if (!this.isSequence(poker)) return
        if (!this.canLastNumberConnectUp(fieldLastCard.number, poker.number)) return
        this.gameStep.push([previousPoker, poker])
      }
      previousPoker.next = null
      fieldLastCard.next = poker

      poker.previous = fieldLastCard
      this.writeCardsDeep(poker)
    },
    writeCardsDeep (poker) {
      poker.deep = poker.previous.deep + 1
      if (poker.next === null) return
      this.writeCardsDeep(poker.next)
    },
    dropOnTemp (slot, poker) {
      // 已經被塞滿不能放啦
      if (slot.next) return
      // 下面還有卡的話不給放啦
      if (poker.next) return
      this.gameStep.push([poker.previous, poker])
      poker.previous.next = null
      poker.deep = 0
      poker.previous = slot
      poker.draggable = function () {
        return true
      }
      slot.next = poker
    },
    dropOnEnd (slot, poker) {
      if (poker.next) return
      const type = Math.floor(poker.number / 13)
      const lastCard = this.findLastCard(slot)
      if (slot.type !== TYPE_MAPPING[type]) return
      if (lastCard.number + 1 !== poker.number) return
      this.gameStep.push([poker.previous, poker])

      poker.previous.next = null

      poker.deep = lastCard.deep + 1
      poker.next = null
      poker.previous = lastCard
      poker.draggable = function () {
        return true
      }
      poker.finish = true
      lastCard.next = poker
      this.isWin = this.specialSlot
        .filter(slot => slot.type)
        .every(slot => {
          let last = this.findLastCard(slot)
          return last.number % 13 + 1 === 13
        })
      if (this.isWin) window.clearInterval(this.timer)
    },
    findLastCard (card) {
      return card.next ? this.findLastCard(card.next) : card
    },
    makeCard (depth, cardNumbers, upperCard = null, deep = 0) {
      let number = cardNumbers.shift()
      const nowCard = {
        number,
        deep,
        next: null,
        previous: upperCard,
        finish: false
      }
      // @todo 須確認此做法不會影響效能
      // 把計算接下來的排是否依照數字順序排序
      // 使用閉包不立即執行等待載入完畢後再執行 (綁定 NestCard.vue 裡面的 :draggable 屬性執行)
      let self = this
      nowCard.draggable = function () {
        return self.isSequence(nowCard)
      }
      if (depth > deep) {
        nowCard.next = this.makeCard(depth, cardNumbers, nowCard, deep + 1)
      }
      return nowCard
    },
    initGame () {
      this.game = []
      this.counter = 0
      this.specialSlot = [{
        number: 0 - 1,
        deep: -1,
        type: 'club',
        next: null
      }, {
        number: 39 - 1,
        deep: -1,
        type: 'heart',
        next: null
      }, {
        number: 13 - 1,
        deep: -1,
        type: 'diamond',
        next: null
      }, {
        number: 26 - 1,
        deep: -1,
        type: 'spade',
        next: null
      }, {
        number: TEMP_SLOT,
        next: null
      }, {
        number: TEMP_SLOT,
        next: null
      }, {
        number: TEMP_SLOT,
        next: null
      }, {
        number: TEMP_SLOT,
        next: null
      }]
      const numbers = Array.from({ length: 52 }, (v, i) => i)
      const rndNumbers = []
      for (let i = 0; i < 52; i++) {
        let index = Math.floor((52 - i) * Math.random())
        rndNumbers.push(...numbers.splice(index, 1))
      }
      for (let i = 0; i < 8; i++) {
        let length = i < 4 ? 5 : 6
        const cardSlot = {
          deep: -1,
          next: null,
          number: 999
        }
        cardSlot.next = this.makeCard(length, rndNumbers, cardSlot)
        this.game.push(cardSlot)
      }
      window.clearInterval(this.timer)
      this.timer = window.setInterval(() => {
        this.counter++
      }, 1000)
    }
  },
  mounted () {
    this.initGame()
  }
}
</script>
<style lang="stylus">
html, body
  padding 0
  margin 0
  height 100%
  width 100%
#app
  font-family 'DM Serif Display', 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  display flex
  width 100%
  height 100%
  justify-content center
  background-color #1A1A1A
.card
  display flex
  width 1200px
  height 90vh
  margin-top 5vh
  background-color #262525
  box-shadow 0 2px 10px 0 rgba(0,0,0,.2)
  flex-direction column
  position relative
  z-index 0
  background linear-gradient(0deg, #1D1D1D 0%, #393737 100%)
  overflow hidden
  &:before
    content ''
    width 1600px
    height 1010px
    background-color #3D3B37
    position absolute
    top -78%
    left -16.7%
    border-radius 50%
    z-index 0
  &:after
    content ''
    width 1600px
    height 1000px
    background: linear-gradient(0deg, rgba(40, 40, 40, 1)0%, rgba(55, 55, 55, 1)80%)
    position absolute
    top -77%
    left -16.7%
    border-radius 50%
    z-index 0

.container
  z-index 1
  width 1000px
  margin 0 auto
  display flex
  justify-content space-around
.cards
  display flex
.dragging
  opacity 1
.special__field
  height auto
  margin-top 80px
  .slot__end
    border 1px solid #A99A7B
    background-color rgba(#655F50, 0.2)
    background-position center center
    background-repeat no-repeat
  .slot__temp
    border 1px solid #A6A5A5
    background-color #262525
.bottom
  margin-bottom 30px
  margin-top auto
  display flex
  align-items center
  .time
    margin-right 20px
    margin-left auto
    color #D8C69A
    font-size 23px
.card__fields
  margin-top 40px
.card__slot
  list-style none
  width 92px
  height 143px
  margin 0
  padding 0
  background-color transparent
  border-radius 5px
.btn
  display flex
  justify-content center
  align-items center
  font-family 'DM Serif Display'
  background-color #161616
  border none
  font-size 18px
  border-radius 25px
  padding 10px
  min-width 106px
  color #D8C69A
  outline none
  cursor pointer
.mr-20
  margin-right 20px
.icon
  margin-right 8px
</style>
