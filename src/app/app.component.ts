import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public todos: {
    id: number,
    title: string,
    done: boolean
  }[] = JSON.parse(window.localStorage.getItem('todos')||'[]')

  public currentEditing: {
    id: number,
    title: string,
    done: boolean
  } = null

  public visibility: string = 'all'

  addTodo(e): void {
    // console.log(e.keyCode);
    const titelText = e.target.value;
    // console.log(!titelText.length)
    if (!titelText.length) {
      return
    }
    const last = this.todos[this.todos.length - 1]
    this.todos.push({
      id: last ? last.id + 1 : 1,
      title: titelText,
      done: false
    })
    // 清除文本框
    e.target.value = '';
    // console.log(this.todos);
  }

  get toggleAll() {
    return this.todos.every(t => t.done)
  }
  set toggleAll(val) {
    this.todos.forEach(t => t.done = val)
  }
  removeTodo(index: number) {
    this.todos.splice(index, 1);
  }
  saveEdit(todo, e) {
    // 保存编辑数据
    todo.title = e.target.value;
    // 去除编辑样式
    this.currentEditing = null
  }
  handleEditKeyUp(e) {
    const { keyCode, target } = e;
    if (keyCode === 27) {
      // 取消编辑
      // 同时把文本框的值恢复为原来的值
      target.value = this.currentEditing.title;
      this.currentEditing = null;
    }
  }

  // 剩余未完成的数量
  get remaningCount() {
    return this.todos.filter(t => !t.done).length
  }

  // 清除所有已完成的任务项
  clearAllDone() {
    this.todos = this.todos.filter(t => !t.done);
  }

  // 实现导航切换数据过滤的功能
  // 1.提供一个属性，该属性会根据当前点击的链接返回过滤之后的数据——filterTodos
  // 2.提供一个属性，用来存储当前点击的链接标识：visibility是一个字符串：all、active、completed
  // 3.为链接添加点击事件，当点击导航链接的时候改变
  get filterTodos() {
    if (this.visibility === 'all') {
      return this.todos
    } else if (this.visibility === 'active') {
      return this.todos.filter(t => !t.done)
    } else if (this.visibility === 'completed') {
      return this.todos.filter(t => t.done)
    }
  }

  // 该函数是一个特殊的Angular生命周期钩子函数，它会在Angular应用初始化的时候执行一次
  ngOnInit() {

    // 刷新保持选中的过滤状态
    this.hashchangeHandler();

    // 当用户点击了锚点的时候，我们需要获取当前的锚点标识
    // 然后动态的将根组件中的visibility设置为当前点击的锚点标识

    // 注意这里要bind this绑定，否则this指向的是window而不是组件实例
    window.onhashchange = this.hashchangeHandler.bind(this)
  }

  // 当Angular组件数据发生改变的时候，ngDoCheck钩子函数会被触发
  // 我们要做的就是在这个钩子函数中持久化储存todos数据
  ngDoCheck(){
    window.localStorage.setItem('todos',JSON.stringify(this.todos))
  }

  hashchangeHandler() {
    const hash = window.location.hash.substr(1)
    switch (hash) {
      case '/':
        this.visibility = 'all'
        break;
      case '/active':
        this.visibility = 'active'
        break;
      case '/completed':
        this.visibility = 'completed'
        break;

    }
  }

}


