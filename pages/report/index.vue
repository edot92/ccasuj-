<template>
    <div>
        <card>
            <card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-layout row wrap>
                            <v-flex xs4>
                                <v-dialog ref="dialog1" persistent v-model="modal1" lazy full-width width="290px">
                                    <v-text-field slot="activator" label="Waktu Mulai" v-model="datetimeAwal" prepend-icon="event" readonly></v-text-field>
                                    <v-date-picker type="date" v-model="datetimeAwal" scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="modal1 = false">Cancel</v-btn>
                                        <v-btn flat color="primary" @click="modal1 = false">OK</v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-flex>
                            <v-flex xs1>
                            </v-flex>
                            <v-flex xs4>
                                <v-dialog ref="dialog1" persistent v-model="modal2" lazy full-width width="290px">
                                    <v-text-field slot="activator" label="Waktu Akhir" v-model="datetimeAkhir" prepend-icon="event" readonly></v-text-field>
                                    <v-date-picker type="date" v-model="datetimeAkhir" scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="modal2 = false">Cancel</v-btn>
                                        <v-btn flat color="primary" @click="modal2 = false">OK</v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-flex>
                            <v-flex xs1>
                                <v-btn @click="downloadCsv">
                                    Export Csv
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-flex>

                </v-layout>
            </card-text>
        </card>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                modal1: false,
                modal2: false,
                dialog1: false,
                dialog2: false,
                datetimeAwal: '',
                datetimeAkhir: '',
            }
        },
        mounted() {},
        methods: {
            saveDate(param) {

            },
            downloadCsv() {
                const url = '/mesin/report/' + this.datetimeAwal + '/' + this.datetimeAkhir + '/'
                window.open(url, '_blank');

            }
        }
    }
</script>