<template>
  <div class="play">
    <h1>Play zone</h1>
    <p> {{game | json }} </p>
    <h2>history</h2>
    <ul>
        <li v-for="hItem in history">
            <p>{{hItem.action.actionId}}</p>   
        </li>
    </ul>
    <h2>choices</h2>
    <ul>
        <li v-for="choice in choices">
            <p>{{choice.actionId}}</p>   
        </li>
    </ul>
  </div>
</template>

<script>


export default {
data () {
    return {
        history: [
            { action: {actionId:'look'}, 
                reaction: [
                    { type: 'msg', detail: 'You can see the abby.' },
                    { type: 'msg', detail: 'You only can go to the west.' }
                ]
            },
            { action: {actionId:'go west'}, 
                reaction: [
                    { type: 'msg', detail: 'You go to the west.' },
                    { type: 'msg', detail: 'You can see the path home.' },
                    { type: 'msg', detail: 'You only can go to the east.' }
                ]
            }  
        ],
        choices: [
            {actionId:'look'}, 
            { actionId:'go east' } 
        ]
    }
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
</style>
