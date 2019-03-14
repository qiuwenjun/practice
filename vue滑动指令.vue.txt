Vue.directive('scroll',{
  bind(el,binding){
      el.initX=el.prevInitX=0;
      el.mousedown=binding.def.mousedown.bind(el);
      el.mousemove=binding.def.mousemove.bind(el);
      el.mouseup=binding.def.mouseup.bind(el);
  },
  inserted(el){
      let child=el.children;
      el.style.width=child.length*(child[0].offsetWidth+parseFloat(getComputedStyle(child[0]).marginRight))+'px';
      el.addEventListener('mousedown',el.mousedown,false)
  },
  mousedown(e){
      this.prevX=e.clientX;
      this.prevTime=Date.now();
      this.speedX=this.speedTime=0;
      this.maxX=this.offsetWidth-this.parentNode.offsetWidth;
      if(this.maxX<0) this.maxX=0;
      document.addEventListener('mousemove',this.mousemove,false);
      document.addEventListener('mouseup',this.mouseup,false);
      e.preventDefault();
  },
  mousemove(e){
      this.nowX=e.clientX;
      this.nowTime=Date.now();
      this.speedX=this.nowX-this.prevX;
      this.speedTime=this.nowTime-this.prevTime;
      this.prevX=this.nowX;
      this.prevTime=this.nowTime;
      let target=this.initX+this.speedX;
      if(target>0||Math.abs(target)>this.maxX){
          this.initX=this.initX+this.speedX*0.1;
      }else{
          this.initX=target;
      }
      this.style.transform='translateX('+this.initX+'px)';
      e.preventDefault();
  },
  mouseup(){
      let speed=this.speedX/this.speedTime*10;
          speed=this.speedTime<=0?0:speed;
      let num=Math.abs(speed)>5?speed*5:speed*3;
      let time=speed?Math.abs(num/speed):0;
      time=time<400?400:time;
      let target=this.initX+num;
      let cub='cubic-bezier(.1,.69,.1,1)';
      if(target>0){
          target=0;
          cub="cubic-bezier(.31,1.23,.59,1.13)";
      }else if(Math.abs(target)>this.maxX){
          target=-this.maxX;
          cub="cubic-bezier(.31,1.23,.59,1.13)";
      }
      this.initX=target;
      this.style.transition='transform '+time+'ms '+cub;
      this.style.transform='translateX('+target+'px)';
      setTimeout(()=>{
          this.style.transition='none';
      },time);
      document.removeEventListener('mousemove',this.mousemove,false);
      document.removeEventListener('mouseup',this.mouseup,false);
  }
})