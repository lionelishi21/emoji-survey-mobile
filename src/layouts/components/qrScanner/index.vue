<template>
<div>
  <div class="question-wrapper">
       <div class="row">
         <div class="col-md-4"></div>
         <div class="col-md-4">
             <qrcode-stream @decode="onDecode" />
         </div>
         <div class="col-md-4"></div>
       </div>
    </div>
     <v-btn
        @click="showQrScanner()"
        color="pink"
        absolute
        top
        right
        dark
        fab
        >
        <v-icon>scanner</v-icon>
     </v-btn>
</div>
</template>
<script src="./index.js"></script>