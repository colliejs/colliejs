# styled

type-safe css-in-js library with zero run time, support multiple variants and dynamic variants

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
