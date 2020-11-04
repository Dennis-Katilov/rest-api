//including VueJS
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'

//Vue component for bootstrap loader
Vue.component('loader', {
    template:`
    <div style="display: flex; justify-content: center; align-items: center">
        <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    <div>
    `
})

//Vue instants
new Vue ({
    el: '#app',
    data() {
        return {
            loading: false,
            form: {
                name: '',
                value: ''
            },
            contacts: [
            ]
        }
    },
    //computed can or not create, if form is empty
    computed: {
        canCreate(){
            return this.form.name.trim() && this.form.value.trim()
        }

    },
    methods:{
        //create new contacts
        async createContact() {
            //get data from form, decomposition
            const { ...contact } = this.form
            const newContact = await request('/api/contacts', 'POST', contact)
            //push new contact to array
            this.contacts.push(newContact)
            //clear form
            this.form.name = this.form.value = ''
        },
        //mark items
        async markContact(id) {
            //get items id
            const contact = this.contacts.find(c => c.id === id)
            //change mark items
            const updated = await request(`/api/contacts/${id}`, 'PUT', {
                ...contact,
                marked: true
            })
            contact.marked = updated.marked
        },
        //remove items
        async removeContact(id){
            await request(`/api/contacts/${id}`, 'DELETE')
            this.contacts = this.contacts.filter(c => c.id !== id)
        }
    },
    //including vue loader-component
   async mounted(){
       this.loading = true
       this.contacts = await request('/api/contacts')
       this.loading = false
    }
})

//get data to front
async function request(url, method="GET", data=null){
    try {
        const headers = {}
        let body
        if(data){
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(data)
        }
        const response = await fetch(url, {
            method,
            headers,
            body
        })
        return await response.json()
    }catch (e){
        console.warn('Error', e.message)
    }
}


