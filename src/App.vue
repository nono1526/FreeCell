<template>
  <div id="app">
    <div class="card">
      <div class="special__field container">
        <div
          class="card__slot"
          v-for="(slot, i) in specialSlot"
          :key="i"
          :style="getCenterMargin(i)"
          :class="{
            'slot__end': slot.number % 1000 < 4,
            'slot__temp': slot.number === 5566
          }"
          @dragover.prevent
          @drop="drop"
        >

        </div>
      </div>
      <div class="card__fields container">

        <div class="card__field"
          v-for="(cards, i) in game"
          :key="i"
          @dragover.prevent
          @drop="drop(cards)"
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
    </div>
  </div>
</template>

<script>
import NestCard from './components/NestCard.vue'

export default {
  name: 'app',
  components: {
    NestCard
  },
  data () {
    return {
      game: [],
      specialSlot: [{
        number: 1000,
        next: null
      }, {
        number: 1001,
        next: null
      }, {
        number: 1002,
        next: null
      }, {
        number: 1003,
        next: null
      }, {
        number: 5566,
        next: null
      }, {
        number: 5566,
        next: null
      }, {
        number: 5566,
        next: null
      }, {
        number: 5566,
        next: null
      }]
    }
  },
  computed: {
    activePoker () {
      return this.$store.state.activePoker
    }
  },
  methods: {
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
    dropToFinish () {

    },
    drop (cards) {
      const fieldLastCard = this.findLastCard(cards)
      const numbers = this.cardToNumbers(this.activePoker)
      if (!this.isSequence(this.activePoker)) return
      console.log('排序過關')
      if (!this.canLastNumberConnectUp(fieldLastCard.number, this.activePoker.number)) return
      console.log('顏色過關')
      this.activePoker.getBefore().next = null
      let depth = numbers.length + fieldLastCard.deep
      let startDeep = fieldLastCard.deep + 1
      fieldLastCard.next = this.makeCard(depth, numbers, fieldLastCard, startDeep)
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
        getBefore () {
          return upperCard
        }
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
    }
  },
  mounted () {
    const numbers = Array.from({ length: 52 }, (v, i) => i)
    const rndNumbers = []
    for (let i = 0; i < 52; i++) {
      let index = Math.floor((52 - i) * Math.random())
      rndNumbers.push(...numbers.splice(index, 1))
    }
    for (let i = 2; i <= 9; i++) {
      const cardSlot = {
        deep: -1,
        next: null,
        number: 999
      }
      cardSlot.next = this.makeCard(i, rndNumbers, cardSlot)
      this.game.push(cardSlot)
    }
    console.log(this.game)
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
  font-family 'Avenir', Helvetica, Arial, sans-serif
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
  height 80vh
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
    // transform translateX(50%)
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
    // transform translateX(50%)
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
  margin-top 80px
  .slot__end
    border 1px solid #A99A7B
    background-color rgba(#655F50, 0.2)
  .slot__temp
    border 1px solid #A6A5A5
    background-color #262525
.card__fields
  margin-top 40px
.card__slot
  list-style none
  border 1px solid rgba(#eaeaea, 0.3)
  width 92px
  box-sizing border-box
  height 141px
  margin 0
  padding 0
  background-color transparent
  border-radius 5px

</style>
