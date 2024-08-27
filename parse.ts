export {}
const testHTML = `
    <html maaa=<a>adawd> awd='awd'>
        <head>
            <title>cool</title>
        </head>
        <body>
            <img src="a" />
        </body>
    </html>
`

enum NODETYPE{
    'root',
    'element',
    'attribute',
    'text'
}

class Node{
    nodeName:string
    nodeType:NODETYPE
    nodeValue?:string
    constructor(nodeName:string,nodeType:NODETYPE,nodeValue?:string){
        this.nodeName=nodeName
        this.nodeType=nodeType
        this.nodeValue=nodeValue
    }
}

class Root extends Node{
    children:(Element|Text)[]
    attriubutes:Attribute[]
    constructor(){
        super('root',NODETYPE['root'])
        this.children = []
        this.attriubutes = []
    }
}

class Element extends Node{
    children:(Element|Text)[]
    attriubutes:Attribute[]
    constructor(nodeName:string){
        super(nodeName,NODETYPE['element'])
        this.children = []
        this.attriubutes = []
    }
    static rule = /^(?<start>\<(?<tagName>[a-zA-Z]+)(?<attrs>(\s*[^=]+=([^\>\s]+|"[^"]+"|'[^']+')\s*){0,}?)\>)(?<content>(?<=\>)[^]+(?=<\/))(?<end>\<\/\k<tagName>\>)/d
    static rule2 = /^(?<start>\<(?<tagName>[a-zA-Z]+)(?<attrs>(\s*[^=]+=([^>\s]+|"[^"]+"|'[^']+')\s*){0,}?)(\/)?\>)/d
    static matchElement(str:string):ReturnType<RegExp['exec']>|null{
        let result = Element.rule.exec(str)
        if(result) return result
        result = Element.rule2.exec(str)
        if(result) return result
        return null
    }
}

class Attribute extends Node{
    constructor(nodeName:string,nodeValue:string){
        super(nodeName,NODETYPE['attribute'],nodeValue)
    }
    static rule = /^(?<name>[^=\s]+)=(?<value>[^\>\s]+|"[^"]+"|'[^']+')/d
    static matchAttribute(str:string):ReturnType<RegExp['exec']>|null{
        return Attribute.rule.exec(str)
    }
}

class Text extends Node{
    constructor(nodeValue:string){
        super('text',NODETYPE['text'],nodeValue)
    }
    static rule = /^(?<content>((?!\<[a-zA-Z]+)[^])*)/d
    static matchText(str:string):ReturnType<RegExp['exec']>|null{
        return Text.rule.exec(str)
    }
}


function getNodeTree<T extends Element|Root>({str,parent,types}:{types?:Array<'text'|'html'|'attr'>,str:string,parent:T}){
    let result:ReturnType<RegExp['exec']>|null
    console.log(str,parent,types)
    // if(!types || types.includes('attr')){
    //     str=str.replace(/^(\n|\s)*/,'')
    // }
    if((types?.some((type:typeof types[0])=>type === 'html') ?? true) && (result = Element.matchElement(str))){
        //是不是元素
        console.log(result,"元素")
        str = str.substring(result[0].length)
        const attrs = result.groups!.attrs
        const content = result.groups!.content
        const tagName = result.groups!.tagName
        const el = new Element(tagName)
        parent.children.push(el)
        console.log(attrs,tagName)
        console.log(content,tagName)
        if(attrs){
            getNodeTree({
                types:["attr"],
                str:attrs.replace(/^\s*|\s*$/g,''),
                parent:el
            })
            // let lastIndex=0
            // let attr = 
            // while(lastIndex<attrs.length){
            //     // console.log(lastIndex)
            //     break
            // }
        }
        if(content){
            getNodeTree({
                types:["html","text"],
                str:content,
                parent:el
            })
        }
        console.log(str,'str')
        if(str){
            getNodeTree({
                types:["html","text"],
                str,
                parent
            }) 
        }
    }else if((types?.some((type:typeof types[0])=>type === 'attr') ?? true) && (result=Attribute.matchAttribute(str))){
        console.log(result,"属性")
        const attrs = str.substring(result[0]!.length)
        const name = result.groups!.name
        const value = result.groups!.value.replace(/"|'/g,'')
        const attr = new Attribute(name,value)
        parent.attriubutes.push(attr)
        console.log(name,'attr')
        console.log(value,'attr')
        if(attrs){
            getNodeTree({
                types:['attr'],
                str:attrs.replace(/^\s*|\s*$/g,''),
                parent
            })
        }
    }else if((types?.some((type:typeof types[0])=>type === 'text') ?? true)  && (result=Text.matchText(str))){
        console.log(result,"文本")
        str = str.substring(result[0].length)
        const content = result.groups!.content
        const text = new Text(content)
        parent.children.push(text)
        if(str){
            getNodeTree({
                types:['html','text'],
                str,
                parent
            })
        }
    }
}
const parent = new Root
getNodeTree({
    str:testHTML,
    parent
})
console.log(parent)