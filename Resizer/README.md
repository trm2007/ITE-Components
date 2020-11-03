# Resizer

Компонент представляет из себя вертикальную или горизонтальную линию,
изменяет размеры сосдених элементов путем перетаскивания мышью.

## Wrapper divs

При встраивании в HTML-код между соседними элементами не должно быть пустых мест (пробелов, переносов строк и т.д.).
Так же содержимое с Resizer для корректного расчета размеров при изменении окна браузера
нужно оборачивать в 2 div-a для растягивания на всю ширину и высоту.

```html
<div class="resize-wrapper-absolute">
  <div class="resize-wrapper-relative">
    <single-page
      @remove-loader="removeLoader"
      @add-loader="addLoader"
    /><resizer Block /><main-footer
      @remove-loader="removeLoader"
      @add-loader="addLoader"
    />
  </div>
</div>
```

Resizer при монтировании убирает прокрутку у всего документа - это важно для корректной работы!

- document.body.style.overflow = 'hidden';

а так же у родителя:

- this.$el.parentElement.style.overflow = 'hidden';

но эти настройки могут быть переопределены в стиле соседних элементов.

В данной реализации (15.10.2020) родительский элемент (содержащий Resizer и соседей) должен изменяться при изменении размера окна НЕ пропорционально,
а на такое же кол-во пикселей! В идеале должен быть привязан к краям окна браузера!

### Стили у соседей и у компонента Resizer

1 ) при вертикальном Resizer-e

для соседей:

```css
{
  display: inline-block;
  /* ИЛИ */
  float: left;
}
```

при этом сам ресайзер может создаваться таким образом:

```html
<div style="display: inline-block">111</div><Resizer InlineBlock /><div style="display: inline-block">222</div>
```

или

```html
<div style="float: left">111</div><Resizer FloatLeft /><div style="float: left">222</div>
```

2 ) при горизонтальном Resizer-e

для соседей:

```css
{
  display: block;
}
```

при этом сам ресайзер может создаваться таким образом:

```html
<div style="display: block">111</div><Resizer Block /><div style="display: block">222</div>
```

### ВАЖНО для контролируемых элементов

```css
{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```
