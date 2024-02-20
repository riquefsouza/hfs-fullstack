<script lang="ts">
import { ref, onMounted } from 'vue';
import { emptyUserAuthenticated } from '../../base/models/UserAuthenticated';
import { AuthService } from '../../base/services/AuthService';

export default {
    setup() {
        const authService = ref<AuthService>(new AuthService());

        const userAuthenticated = ref(emptyUserAuthenticated);

        onMounted(() => {
            authService.value.getUser().subscribe(user => userAuthenticated.value = user);
        });

        return { userAuthenticated };
    }
}
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card px-6 py-6">
                <p-card header="Usuário logado">
                    <p class="m-0">
                        <b>ID: </b>
                        {{userAuthenticated.id}}
                        <br><br>
                        <b>Login: </b>
                        {{userAuthenticated.userName}}
                        <br><br>
                        <b>E-mail: </b>
                        {{userAuthenticated.email}}
                        <br><br>
                        <b>E-mail verificado: </b>
                        {{userAuthenticated.emailVerified ? 'Sim' : 'Não'}}
                        <br><br>
                        <b>Nome: </b>
                        {{userAuthenticated.fullName}}
                        <br><br>
                        <b>É administrador: </b>
                        {{userAuthenticated.isAdmin ? 'Sim' : 'Não'}}
                        <br><br>
                        <b>Papéis: </b>
                        <li v-for="role in userAuthenticated.roles">
                            {{ role }}
                        </li>                        
                        <br><br>
                    </p>
                </p-card>       
            </div>
        </div>
    </div>
</template>
