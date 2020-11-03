<template>
  <div
    v-if="Vertical"
    class="divider-wrapper-vertical"
    :class="
      FloatLeft ? 'float-left ' : (FloatRight ? 'float-right ' : '' )
      + (InlineBlock ? 'inline-block ' : (Block ? 'block' : '') )
    "
    :style="'background-color:' + Color + ';'"
    @mousedown="mousedown"
    @dragstart="stub"
  >
    <div
      class="divider-vertical"
      :style="'border-color: ' + DivideColor + ';'"
    />
  </div>
  <div
    v-else
    class="divider-wrapper-horizontal"
    :class="
      FloatLeft ? 'float-left ' : (FloatRight ? 'float-right ' : '' )
      + (InlineBlock ? 'inline-block ' : '')
    "
    :style="'background-color:' + Color + ';'"
    @mousedown="mousedown"
    @dragstart="stub"
  >
    <div
      class="divider-horizontal"
      :style="'border-color: ' + DivideColor + ';'"
    />
  </div>
</template>

<script>
export default {
  name: "Resizer",
  props: {
    Vertical: {
      type: Boolean,
      default: false,
    },
    Color: {
      type: String,
      default: "#f5f5f5",
    },
    DivideColor: {
      type: String,
      default: "darkgray",
    },
    FloatLeft: {
      type: Boolean,
      default: false,
    },
    FloatRight: {
      type: Boolean,
      default: false,
    },
    InlineBlock: {
      type: Boolean,
      default: false,
    },
    Block: {
      type: Boolean,
      default: false,
    },
    LeftMinWidth: {
      type: [Number, String],
      default: 0,
    },
    TopMinHeight: {
      type: [Number, String],
      default: 0,
    },
    RightMinWidth: {
      type: [Number, String],
      default: 0,
    },
    BottomMinHeight: {
      type: [Number, String],
      default: 0,
    },
    LeftWidth: {
      type: [Number, String],
      default: 0,
    },
    TopHeight: {
      type: [Number, String],
      default: 0,
    },
    RightWidth: {
      type: [Number, String],
      default: 0,
    },
    BottomHeight: {
      type: [Number, String],
      default: 0,
    },
  },
  data: function () {
    return {
      // координаты мыши во время фиксации начала перемещения и во время фиксации оуончания перемещения,
      // испольщуются в mousemove
      StartX: null,
      StartY: null,
      EndX: null,
      EndY: null,

      Prev: null, // элемент перед данным ресайзером
      Next: null, // элемент следующий послк ресайзера
      Parent: null, // родитель для ресайзера и соседних элементов

      // сохраненные значения ширин и высот перед изменениями...
      LastPrevWidth: 0,
      LastPrevHeight: 0,
      LastNextWidth: 0,
      LastNextHeight: 0,
      LastParentOffsetWidth: 0,
      LastParentOffsetHeight: 0,

      // оригинальные (начальные) значения
      PrevOriginalWidth: 0,
      PrevOriginalHeight: 0,
      NextOriginalWidth: 0,
      NextOriginalHeight: 0,
    };
  },
  computed: {},
  mounted: function () {
    // сохраняем предыдущий, последующий элементы и родителя, а так же их размеры
    this.Prev = this.$el.previousElementSibling;
    this.Next = this.$el.nextElementSibling;
    this.Parent = this.$el.parentNode;

    this.PrevOriginalWidth = getComputedStyle(this.Prev).width; // this.Prev.style.width;
    this.PrevOriginalHeight = getComputedStyle(this.Prev).height; // this.Prev.style.height;
    this.NextOriginalWidth = getComputedStyle(this.Next).width; // this.Next.style.width;
    this.NextOriginalHeight = getComputedStyle(this.Next).height; // this.Next.style.height;
    document.body.style.overflow = "hidden";
    this.$el.parentElement.style.overflow = "hidden";

    window.addEventListener("resize", this.resizeWindow);
    //this.getSizesControl();
    this.getAllLastSizes();

    // если не вертикальный, значит изменяет высоты элементов, отслеживаем изменнеие размера по Y
    // if( !this.Vertical ) { this.$EventBus.$on('vertical-resize', this.resizeWindow); }
    // И наоборот, если вертикальный, значит изменяет ширину элементов, отслеживаем изменнеие размера по X
    // else { this.$EventBus.$on('horizontal-resize', this.resizeWindow); }
  },
  updated: function () {
    this.getAllLastSizes();
  },
  watch: {
    // отслеживает изменение ширины левой части
    LeftWidth: function (LeftWidth) {
      if (LeftWidth === null || !this.Prev || !this.Next || !this.Vertical) {
        return;
      }
      let OldPrevComputedWidth = getComputedStyle(this.Prev).width;
      this.Prev.style.width = `${LeftWidth}px`;
      let NewPrevComputedWidth = getComputedStyle(this.Prev).width;

      // размеры следующего элемента вычисляем путем вычитания разницы новой и старой ширины предществующего элемента
      this.Next.style.width = `calc(${
        getComputedStyle(this.Next).width
      } - (${NewPrevComputedWidth} - ${OldPrevComputedWidth}))`;
      this.getAllLastSizes();
    },
    // отслеживает изменение высоты верхней части
    TopHeight: function (TopHeight) {
      if (TopHeight === null || !this.Prev || !this.Next || this.Vertical) {
        return;
      }
      let OldPrevComputedHeight = getComputedStyle(this.Prev).height;
      this.Prev.style.height = `${TopHeight}px`;
      let NewPrevComputedHeight = getComputedStyle(this.Prev).height;
      // размеры следующего элемента вычисляем путем вычитания разницы новой и старой высоты предществующего элемента
      // толщины Resizer-а
      this.Next.style.height = `calc(${
        getComputedStyle(this.Next).height
      } - (${NewPrevComputedHeight} - ${OldPrevComputedHeight}))`;
      this.getAllLastSizes();
    },
    // отслеживает изменение ширины правой части
    RightWidth: function (RightWidth) {
      if (RightWidth === null || !this.Prev || !this.Next || !this.Vertical) {
        return;
      }
      let OldNextComputedWidth = getComputedStyle(this.Next).width;
      this.Next.style.width = `${RightWidth}px`;
      let NewNextComputedWidth = getComputedStyle(this.Next).width;

      // размеры предыдущего элемента вычисляем путем вычитания разницы новой и старой ширины следующего элемента
      this.Prev.style.width = `calc(${
        getComputedStyle(this.Prev).width
      } - (${NewNextComputedWidth} - ${OldNextComputedWidth}))`;
      this.getAllLastSizes();
    },
    // отслеживает изменение высоты нижней части
    BottomHeight: function (BottomHeight) {
      if (BottomHeight === null || !this.Prev || !this.Next || this.Vertical) {
        return;
      }
      let OldNextComputedHeight = getComputedStyle(this.Next).height;
      this.Next.style.height = `${BottomHeight}px`;
      let NewNextComputedHeight = getComputedStyle(this.Next).height;
      // размеры следующего элемента вычисляем путем вычитания разницы новой и старой высоты предществующего элемента
      // толщины Resizer-а
      this.Prev.style.height = `calc(${
        getComputedStyle(this.Prev).height
      } - (${NewNextComputedHeight} - ${OldNextComputedHeight}))`;
      this.getAllLastSizes();
    },
  },
  methods: {
    // при изменении размера окна необходимо изменить пропорциоально размеры элементов,
    // иначе они останутся с прежними размерами, так как жестко задаются при ресайзе
    resizeWindow: function () {
      // вычисляем какую часть родителя занимали оба элемента, контролируемые данным ресайзером
      let SummProportionX = (this.LastPrevOffsetWidth + this.LastNextOffsetWidth) /
          (this.LastParentWidth),
          SummProportionY = (this.LastPrevOffsetHeight + this.LastNextOffsetHeight) /
          (this.LastParentWidth);
      let // вычисляем на сколько уменьшилась ширина и высота родителя
        DeltaX = this.Parent.clientWidth - this.LastParentWidth,
        DeltaY = this.Parent.clientHeight - this.LastParentHeight;
      let // как соотносились размеры компонентов к родителю до ресайза,
        PrevProportionX =
          this.LastPrevOffsetWidth /
          (this.LastParentWidth),
        PrevProportionY =
          this.LastPrevOffsetHeight /
          (this.LastParentHeight),
        NextProportionX =
          this.LastNextOffsetWidth /
          (this.LastParentWidth),
        NextProportionY =
          this.LastNextOffsetHeight /
          (this.LastParentHeight);

      if (this.Prev) {
        // если вертикальный, то изменяем ширину первого элемента
        if (this.Vertical) {
          this.Prev.style.width = `calc(${this.LastPrevWidth} + ${PrevProportionX} * ${DeltaX}px)`;
        }
        // если горизонтальный, то изменяем высоту первого элемента
        else {
          this.Prev.style.height = `calc(${this.LastPrevHeight} + ${PrevProportionY} * ${DeltaY}px)`;
        }
      }
      if (this.Next) {
        // размеры следующего элемента вычисляем путем вычитания из размеров клиентской зоны родителя
        // размеров первого элемента и толщину Resizer-а
        if (this.Vertical) {
          this.Next.style.width = `calc(${this.LastNextWidth} + ${NextProportionX} * ${DeltaX}px)`;
        } else {
          this.Next.style.height = `calc(${this.LastNextHeight} + ${NextProportionY} * ${DeltaY}px)`;
        }
      }

      this.getAllLastSizes();
    },
    old_resizeWindow: function () {
      console.log("resizeWindow, this->", this);
      let // вычисляем на сколько уменьшилась ширина и высота
          DeltaX = this.Parent.clientWidth - this.LastParentWidth,
          DeltaY = this.Parent.clientHeight - this.LastParentHeight;
      let // как соотносились размеры компонентов до ресайза,
          // вычисляется только для первого элемента,
          // для последующего просто отнимается от 1
          OldProportionX =
              this.LastPrevOffsetWidth /
              (this.LastPrevOffsetWidth + this.LastNextOffsetWidth),
          OldProportionY =
              this.LastPrevOffsetHeight /
              (this.LastPrevOffsetHeight + this.LastNextOffsetHeight);

      if (this.Prev) {
        // если вертикальный, то изменяем ширину первого элемента
        if (this.Vertical) {
          this.Prev.style.width = `calc(${this.LastPrevWidth} + ${OldProportionX} * ${DeltaX}px)`;
        }
        // если горизонтальный, то изменяем высоту первого элемента
        else {
          this.Prev.style.height = `calc(${this.LastPrevHeight} + ${OldProportionY} * ${DeltaY}px)`;
        }
      }
      if (this.Next) {
        // размеры следующего элемента вычисляем путем вычитания из размеров клиентской зоны родителя
        // размеров первого элемента и толщину Resizer-а
        if (this.Vertical) {
          this.Next.style.width = `calc(${
              getComputedStyle(this.Parent).width
          } - ${getComputedStyle(this.Prev).width} - 6px)`;
        } else {
          this.Next.style.height = `calc(${
              getComputedStyle(this.Parent).height
          } - ${getComputedStyle(this.Prev).height} - 6px)`;
        }
      }

      this.getAllLastSizes();
    },
    // сохраняем размеры предыдущего, последующего элементов и родителя
    getAllLastSizes: function () {
      this.LastPrevWidth = getComputedStyle(this.Prev).width;
      this.LastPrevHeight = getComputedStyle(this.Prev).height;
      this.LastPrevOffsetWidth = this.Prev.offsetWidth;
      this.LastPrevOffsetHeight = this.Prev.offsetHeight;

      this.LastNextWidth = getComputedStyle(this.Next).width;
      this.LastNextHeight = getComputedStyle(this.Next).height;
      this.LastNextOffsetWidth = this.Next.offsetWidth;
      this.LastNextOffsetHeight = this.Next.offsetHeight;

      // для родителя важно получить размеры в пикселях именно клиентчкой части,
      // где расположены контролируемые элементы, для дальнейщего расчета пропорций
      this.LastParentWidth = this.Parent.clientWidth;
      this.LastParentHeight = this.Parent.clientHeight;
    },
    // заглушка для событий dragstart на элементах ресайзера
    // а так же для mousemove на соседних элементах
    stub: function (e) {
      if (e) {
        e.preventDefault();
      }
      return false;
    },
    // отслеживание нажатия мыши, перехватываем начало dragstart,
    // далее событие перемещения мыши и отпускания клавиши так же будет обрабатывать document
    mousedown: function (e) {
      this.StartX = this.EndX = e.clientX;
      this.StartY = this.EndY = e.clientY;
      document.addEventListener("mousemove", this.mousemove);
      document.addEventListener("mouseup", this.mouseup);
      this.$el.addEventListener("mouseup", this.mouseup);
      // ставим заглушки на событие перемещения мыши для соседних элементов,
      // что бы не происходило нежелательное выделение текска и скроллинг
      this.Prev.addEventListener("mousemove", this.stub);
      this.Next.addEventListener("mousemove", this.stub);
    },
    // отслеживаем когда будет отпущена кнопка мыши
    mouseup: function () {
      document.removeEventListener("mouseup", this.mouseup);
      document.removeEventListener("mousemove", this.mousemove);
      this.$el.removeEventListener("mouseup", this.mouseup);
      // убираем заглушку с события mousemove на соседних элементах
      this.Prev.removeEventListener("mousemove", this.stub);
      this.Next.removeEventListener("mousemove", this.stub);
      //      this.$el.removeEventListener('mousemove', this.mousemove);
    },
    // событие перемещения мыши при изменении размеров...
    mousemove: function (e) {
      this.StartX = this.EndX;
      this.StartY = this.EndY;
      this.EndX = e.clientX;
      this.EndY = e.clientY;
      this.changesPercent({
//      this.changesDelta({
        DeltaX: this.EndX - this.StartX,
        DeltaY: this.EndY - this.StartY,
      });
console.log("mousemove->this: ", this);
      //      this.checkAndCorrect();
      this.getAllLastSizes();
      if (this.checkCollapse()) {
        this.mouseup();
      }
    },
    /**
     * проверяет достиг ли один из соседей минимальной/максимальной ширины/высоты,
     * в зависимости от этого генерирует событие
     */
    checkCollapse: function () {
      // если есть предществующий эл-т
      if (this.Prev) {
        // если ресайзер вертикальный, то нужно контролировать ширину соседей
        if (this.Vertical) {
          // если ширина предществующего элемента меньше установленной
          if (this.Prev.offsetWidth < this.LeftMinWidth) {
            this.$emit("left-collapsed");
            return true;
          }
        }
        // если ресайзер не вертикальный (горизонтальный), то нужно контролировать высоту соседей
        else {
          // если высота предществующего элемента меньше установленной
          if (this.Prev.offsetHeight < this.TopMinHeight) {
            this.$emit("top-collapsed");
            return true;
          }
        }
      }
      // если есть следующий эл-т
      if (this.Next) {
        // если ресайзер вертикальный, то нужно контролировать ширину соседей
        if (this.Vertical) {
          // если ширина следующего элемента меньше установленной
          if (this.Next.offsetWidth < this.RightMinWidth) {
            this.$emit("right-collapsed");
            return true;
          }
        }
        // если ресайзер не вертикальный (горизонтальный), то нужно контролировать высоту соседей
        else {
          // если высота следующего элемента меньше установленной
          if (this.Next.offsetHeight < this.BotoomMinHeight) {
            this.$emit("bottom-collapsed");
            return true;
          }
        }
      }
    },
    /**
     * рассчитывает ширину в % от изменения Delta в px
     */
    changesPercent: function(Delta) {
      if (this.Vertical) {
        let ParentXCoeff = this.LastParentOffsetWidth / 100;
        let PercentDeltaX = Delta.DeltaX / ParentXCoeff;
        // сначала уменьшаем элемент, что бы не "вылазили за пределы области"
        if (Delta.DeltaX > 0) {
          if (this.Next) {
            this.Next.style.width = `calc(${
              getComputedStyle(this.Next).width
            } - ${PercentDeltaX}%`;
          }
          if (this.Prev) {
            this.Prev.style.width = `calc(${
              getComputedStyle(this.Prev).width
            } + ${PercentDeltaX}%`;
          }
        } else {
          if (this.Prev) {
            this.Prev.style.width = `calc(${
              getComputedStyle(this.Prev).width
            } + ${PercentDeltaX}%`;
          }
          if (this.Next) {
            this.Next.style.width = `calc(${
              getComputedStyle(this.Next).width
            } - ${PercentDeltaX}%`;
          }
        }
      } else {
        let ParentYCoeff = this.LastParentOffsetHeight / 100;
        let PercentDeltaY = Delta.DeltaY / ParentYCoeff;
        // сначала уменьшаем элемент, что бы не "вылазили за пределы области"
        if (Delta.DeltaY > 0) {
          if (this.Next) {
            this.Next.style.height = `calc(${
              getComputedStyle(this.Next).height
            } - ${PercentDeltaY}%`;
          }
          if (this.Prev) {
            this.Prev.style.height = `calc(${
              getComputedStyle(this.Prev).height
            } + ${PercentDeltaY}%`;
          }
        } else {
          if (this.Prev) {
            this.Prev.style.height = `calc(${
              getComputedStyle(this.Prev).height
            } + ${PercentDeltaY}%`;
          }
          if (this.Next) {
            this.Next.style.height = `calc(${
              getComputedStyle(this.Next).height
            } - ${PercentDeltaY}%`;
          }
        }
      }
    },
    /**
     * изменяет размеры на заданную дельту, при этом если элемент Vertical,
     * то изменится только ширина, иначе тольео высота!!!
     * @param Object Delta - {DeltaX, DeltaY}
     */
    changesDelta: function (Delta) {
      if (this.Vertical) {
        // сначала уменьшаем элемент, что бы не "вылазили за пределы области"
        if (Delta.DeltaX > 0) {
          if (this.Next) {
            this.Next.style.width = `calc(${
              getComputedStyle(this.Next).width
            } - ${Delta.DeltaX}px`;
          }
          if (this.Prev) {
            this.Prev.style.width = `calc(${
              getComputedStyle(this.Prev).width
            } + ${Delta.DeltaX}px`;
          }
        } else {
          if (this.Prev) {
            this.Prev.style.width = `calc(${
              getComputedStyle(this.Prev).width
            } + ${Delta.DeltaX}px`;
          }
          if (this.Next) {
            this.Next.style.width = `calc(${
              getComputedStyle(this.Next).width
            } - ${Delta.DeltaX}px`;
          }
        }
      } else {
        // сначала уменьшаем элемент, что бы не "вылазили за пределы области"
        if (Delta.DeltaY > 0) {
          if (this.Next) {
            this.Next.style.height = `calc(${
              getComputedStyle(this.Next).height
            } - ${Delta.DeltaY}px`;
          }
          if (this.Prev) {
            this.Prev.style.height = `calc(${
              getComputedStyle(this.Prev).height
            } + ${Delta.DeltaY}px`;
          }
        } else {
          if (this.Prev) {
            this.Prev.style.height = `calc(${
              getComputedStyle(this.Prev).height
            } + ${Delta.DeltaY}px`;
          }
          if (this.Next) {
            this.Next.style.height = `calc(${
              getComputedStyle(this.Next).height
            } - ${Delta.DeltaY}px`;
          }
        }
      }
    },
    /**
     * изменяет размеры на коэффициент, все-таки используется Vertical или не используетс играет роль...
     * // меняются все размеры независимо от Vertical,
     * // используется при изменении размеров окна, может появляться прокрука,
     * // тогда при изменении только одного размера появивщаяся прокрутка меняет второй!
     * @param Object Coeff - {CoeffX, CoeffY}
     */
    changesCoeff: function (Coeff) {
      if (this.Prev) {
        // если вертикальные, то изменяем ширину соседних эл-тов
        if (this.Vertical) {
          this.Prev.style.width = `calc(${this.LastPrevWidth} * ${Coeff.CoeffX})`;
        } else {
          this.Prev.style.height = `calc(${this.LastPrevHeight} * ${Coeff.CoeffY})`;
        }
      }
      if (this.Next) {
        if (this.Vertical) {
          this.Next.style.width = `calc(${this.LastNextWidth} * ${Coeff.CoeffX})`;
        } else {
          this.Next.style.height = `calc(${this.LastNextHeight} * ${Coeff.CoeffY})`;
        }
      }
    },
    /**
     * проверяет и корректирует, если в результате суммирующая ширина/высота
     * соседних элементов превышает общую ширину клиентской области контейнера
     * или наоборот меньше, то последний элемент "подгоняется" под нужный размер
     */
    checkAndCorrect: function () {
      let DeltaX, DeltaY;
      let SummX = this.Next.offsetWidth + 6 + this.Prev.offsetWidth,
        SummY = this.Next.offsetHeight + 6 + this.Prev.offsetHeight;

      if (this.Vertical && this.Parent.clientWidth != SummX) {
        DeltaX = SummX - this.Parent.clientWidth;
        this.Next.style.width = `calc(${
          getComputedStyle(this.Next).width
        } - ${DeltaX}px)`;
      }
      if (!this.Vertical && this.Parent.clientHeight != SummY) {
        DeltaY = SummY - this.Parent.clientHeight;
        this.Next.style.height = `calc(${
          getComputedStyle(this.Next).height
        } - ${DeltaY}px)`;
      }
    },
    /**
     * берет под управление ширину/высоту дочерних элементов, т.е. меняет их на calc(...)
     */
    getSizesControl: function () {
      if (this.Vertical) {
        this.Next.style.width = `calc(${getComputedStyle(this.Next).width} )`;
        this.Prev.style.width = `calc(${getComputedStyle(this.Prev).width} )`;
      } else {
        this.Next.style.height = `calc(${getComputedStyle(this.Next).height} )`;
        this.Prev.style.height = `calc(${getComputedStyle(this.Prev).height} )`;
      }
    },
  },
};
</script>

<style scoped>
.divider-horizontal {
  margin-bottom: 2px;
  border-bottom: 2px solid;
}
.divider-wrapper-horizontal {
  height: 6px;
  padding-top: 2px;
  cursor: row-resize;
  box-sizing: border-box;
  width: 100%;
  /*  position: absolute;*/
}

.divider-vertical {
  margin-right: 2px;
  border-right: 2px solid;
  height: 100%;
}
.divider-wrapper-vertical {
  width: 6px;
  padding-left: 2px;
  cursor: col-resize;
  box-sizing: border-box;
  height: 100%;
  /*  position: absolute;*/
}

.float-left {
  float: left;
}
.float-right {
  float: right;
}
.inline-block {
  display: inline-block;
}
.block {
  display: block;
}
</style>
