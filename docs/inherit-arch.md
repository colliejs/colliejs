//===================================================================================================== // 数据结构（inheritance aritchture ） // 没有被使用的组件(比如 SButton,RedButton)，会被删除，也不会生成样式。 //=====================================================================================================

/\*\*

-
-            button
-           /      \
- SButton(x) BaseButton
-              /  /      \
-     RedBtn(x)  BlueBtn  <BaseButton/>
-                 /   \
-        <BlueBtn/>  <BlueBtn/>
  \*/

## concept:

- styledComponent and styledElement

```javascript
const Title = styled('h1', {
  fontSize: '1.5em',
  textAlign: 'center',
  color: 'palevioletred',
});
const App = () => <Title css={{ color: 'red' }}>Hello World!</Title>;
// Title is a styled component
//<Title> is a styled element
```


## features
- override style
  - 通过@layer来实现. @layer需要通过依赖树实现
- variable virants
  - 只能在runtime来实现。否则需要实现依赖树
  - 我不需要
- 
## design

- 依赖树
  - root 节点一定是 hostComponent 或者一个第三方的组件。
    - 如果第三方组件没有传递 className 属性，则需要添加一个包裹标签才不会让样式丢失
    - 不会是 styledComponent
  - 叶子节点一定是 styledElement

- 依赖树的构建过程：
  - 1. 查找styledCompoponent构造出多棵树
  - 2. 判断styledEelments属于哪棵树，并添加到该树中

## api

- parseCode
