import { defineComponent, h } from 'vue-demi'
import { SlotsProps } from './interface'

const observer = {
  inject: ['virtualList'],
  data () {
    return {
      observer: null
    }
  },
  mounted () {
    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => {
        this.onSizeChange()
      })
      this.$el && this.observer.observe(this.$el)
    }
  },
  updated () {
    this.onSizeChange()
  },
  beforeDestroy () {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  },
  methods: {
    onSizeChange () {
      if (this.virtualList[this.event]) {
        this.virtualList[this.event](this.dataKey, this.getCurrentSize())
      }
    },
    getCurrentSize () {
      const sizeKey = this.isHorizontal ? 'offsetWidth' : 'offsetHeight'
      return this.$el ? this.$el[sizeKey] : 0
    }
  }
}

export const Items = defineComponent({
  mixins: [observer],
  props: SlotsProps,
  render () {
    const { tag, dataKey } = this
    return h(tag, {
      key: dataKey,
      'data-key': dataKey
    }, this.$slots.default())
  }
})

export const Slots = defineComponent({
  mixins: [observer],
  props: SlotsProps,
  render () {
    const { tag, dataKey } = this
    return h(tag, {
      key: dataKey,
      role: dataKey
    }, this.$slots.default())
  }
})
