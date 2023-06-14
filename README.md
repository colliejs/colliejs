# styled


```javascript

const Button = styled('button',{

  variants:{
    shape:{
      round:{
        borderRadius:999999
      },
      rect:{
        borderRadius:0
      },
      dynamic:(x)=>({
        borderRadius:x
      })
    }
  }
})

````
