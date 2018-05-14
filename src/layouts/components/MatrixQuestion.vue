<template>
 <div class="question-overlay">
    <div class="inner">
        <h2 class="quesHeader">{{question}}</h2>
    </div>
    <div class="question_content">
        <table class="table">
            <thead>
                <tr>
                    <th></th>
                    <th v-for="(mt, mhkey) in matrixs" v-if="q.id == mt.question_id" :key="key">
                        <div class="text-center">
                            <div class="circle">
                                <img class="img-responsive emoji-img" :src="'static/emoji/'+mt.emoji+'.svg'">
                            </div>
                            <h4 class="text-center">{{mt.matrix}}</h4>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(ans, akey) in all_answers" v-if="q.id == ans.question_id" :key="key">
                    <div class="text-left mt-3">
                        <td><h4 class="text-left">{{ans.answer}}</h4></td>
                    </div>
                    <td v-for="(mt, mkey) in matrixs" v-if="q.id == mt.question_id" :key="key">
                        <div class="center_check">
                            <label class="matrix_ques">
                                <input
                                 @change="showMatrixAlert(key, mkey)"
                                :name="'answers_matrixs['+ans.id+']'"
                                    class='myinput large custom'
                                    type="radio"
                                    v-model="matrix_responses[ans.id]"
                                    :value="q.id+'-'+mt.id
                                ">
                                <i class="input-helper"></i>
                            </label>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
   <!--  <div class="nextPrevious">
        <a @click="$router.go(-1)" v-if="key == 0" class="button pull-left">Back to Introduction</a>
        <a v-else @click="getPrevPage(key)" class="button pull-left">Previous Question</a>
        <a v-if="key == all_questions.length-1"  @click="goTSubmit()" class="button pull-right">Submit</a>
        <a v-else  @click="getNextPage(key)" class="button pull-right">Next Questions</a>
    </div> -->
 </div>
</template>
<script>
export default {
    props:['question', 'answers', 'matrixs'],
    data() {

    }, 
    methods: {

    }
}
</script>