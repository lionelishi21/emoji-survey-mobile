<template>
<div>
  <div class="question-wrapper">
       <div class="row">
         <div class="col-md-4"></div>
         <div class="col-md-4">
             <qrcode-stream v-if="scanner" @decode="onDecode" @init="onInit" />
         </div>
         <div class="col-md-4"></div>
       </div>
    </div>
     <v-btn
        @click="showQrScanner()"
        color="pink"
        absolute
        bottom
        right
        dark
        fab
        >
        <v-icon>scanner</v-icon>
     </v-btn>
</div>
</template>
<script src="./index.js"></script>