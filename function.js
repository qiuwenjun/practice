    //模拟的sort排序
    Array.prototype.sort=function(callBack){
      let This=this;
      callBack=callBack&&callBack(1,2)!=undefined? callBack:true;        //如果有回调函数，就按回调函数的模式来，否则默认就是从小到大
      for(let i=0;i<This.length;i++){
        for(let l=i+1;l<This.length;l++){
          if(typeof callBack==='boolean'||(This[i]-This[l])===callBack(This[i],This[l])){          //从小到大排序
            if(This[i] > This[l]){
              console.log(1);
              let value=This.splice(l,1,This[i]);
              This.splice(i,1,value[0]);
            }
          }else if((This[l] - This[i]) === callBack(This[i], This[l])){               //从大到小
            if (This[i] < This[l]) {
              console.log(2);
              let value = This.splice(l, 1, This[i]);
              This.splice(i, 1, value[0]);
            }
          }else{                    //随机排序
            let value=callBack(This[i], This[l]);
            if(Math.sign(value)==-1){
              console.log(3);
              let value = This.splice(l, 1, This[i]);
              This.splice(i, 1, value[0]);
            }
          }
        }
      }
      return This;
    };
    let arr = [1, 2, 3, 9, 8, 4, 5, 5];
    arr.sort((a,b)=>{
      return b-a;
    })