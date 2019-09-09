<script>
import ResizeObserver from "@juggle/resize-observer";

export default {
  props: {
    self: { type: Boolean, default: false },
    maxW: {},
    minW: {},
    tag: { type: String, default: "div" },
    p: { type: String },
    pl: { type: String },
    pr: { type: String },
    pt: { type: String },
    pb: { type: String },
    px: { type: String },
    py: { type: String },
    m: { type: String },
    ml: { type: String },
    mr: { type: String },
    mt: { type: String },
    mb: { type: String },
    mx: { type: String },
    my: { type: String },
    w: { type: String },
    text: { type: String }
  },
  data() {
    return {
      currentWidth: null,
      oldProps: null,
      values: {
        p: null,
        pl: null,
        pr: null,
        pt: null,
        pb: null,
        px: null,
        py: null,
        m: null,
        ml: null,
        mr: null,
        mt: null,
        mb: null,
        mx: null,
        my: null,
        w: null,
        text: null
      }
    };
  },
  computed: {
    styles() {
      return {
        padding: this.values.p,
        paddingLeft: this.prioritizeValue("pl", "px"),
        paddingRight: this.prioritizeValue("pr", "px"),
        paddingTop: this.prioritizeValue("pt", "py"),
        paddingBottom: this.prioritizeValue("pb", "py"),

        margin: this.values.m,
        marginLeft: this.prioritizeValue("ml", "mx"),
        marginRight: this.prioritizeValue("mr", "mx"),
        marginTop: this.prioritizeValue("mt", "my"),
        marginBottom: this.prioritizeValue("mb", "my"),

        width: this.values.w,

        fontSize: this.values.text
      };
    },
    minWidth() {
      return this.minW ? parseInt(this.minW) : parseInt(this.$fluid.minW);
    },
    maxWidth() {
      return this.maxW ? parseInt(this.maxW) : parseInt(this.$fluid.maxW);
    }
  },
  methods: {
    handleResize(entries, observer) {
      this.caluculate();
      this.applyStyles();
      this.currentWidth = this.getCurrentWidth();
    },
    applyStyles() {
      /* using v-bind:style caused some weird issues that I couldn't figure out */
      const styles = this.styles;
      Object.keys(styles).forEach(prop => {
        if (styles[prop] === null) {
          return this.$el.style.removeProperty(prop);
        } 
        this.$el.style[prop] = styles[prop];
      });
    },
    caluculate() {
      Object.keys(this.values)
        .filter(k => this[k])
        .forEach(prop => {
          const value = this.calcValueForProp(prop);
          this.values[prop] = value;
        });
    },
    calcValueForProp(prop) {
      const currentWidth = this.getCurrentWidth();
      const { minWidth, maxWidth } = this;
      const [maxValue, minValue, unit] = this.parseValuesForProp(prop);

      let value =
        minValue +
        ((maxValue - minValue) * (currentWidth - minWidth)) /
          (maxWidth - minWidth);

      value =
        currentWidth > maxWidth
          ? maxValue
          : currentWidth < minWidth
          ? minValue
          : value;

      return `${value}${unit}`;
    },
    parseValuesForProp(key) {
      const [max, min] = this[key].split(" ");
      const mapping =
        key == "text" ? this.$fluid.fontSize : this.$fluid.spacing;
      const maxValue = parseFloat(mapping[max]);
      const minValue = parseFloat(mapping[min]);
      const unit = mapping[max].slice(maxValue.toString().length);

      return [maxValue, minValue, unit];
    },
    prioritizeValue(a, b) {
      return this.values[a] !== null ? this.values[a] : this.values[b];
    },
    getCurrentWidth() {
      return this.getReference().clientWidth;
    },
    getReference() {
      return this.self ? this.$el : document.body;
    },
    watchProps() {
      this.oldProps = { ...this.$props };
      this.$watch(
        "$props",
        newProps => {
          if (JSON.stringify(newProps) !== JSON.stringify(this.oldProps)) {
            this.handleResize();
          }
        },
        {
          deep: true
        }
      );
    }
  },
  mounted() {
    this.watchProps();

    this.ro = new ResizeObserver(this.handleResize);
    this.ro.observe(this.getReference());
  },
  destroyed() {
    this.ro.disconnect();
  },
  render(h) {
    return h(
      this.tag,
      this.$scopedSlots.default({ width: this.currentWidth })
    );
  }
};
</script>