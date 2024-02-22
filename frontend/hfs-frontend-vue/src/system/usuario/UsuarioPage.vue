<script lang="ts">
import { ref, onMounted } from 'vue';
import { emptyUserAuthenticated } from '../../base/models/UserAuthenticated';
import keycloakService from '../../main.ts';

export default {
    setup() {
        const userAuthenticated = ref(emptyUserAuthenticated);

        onMounted(() => {
            userAuthenticated.value = keycloakService.getUserAuthenticated();
        });

        return { userAuthenticated };
    }
}
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card px-6 py-6">
                <Card>
                    <template #title>Usuário logado</template>
                    <template #content>
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
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>
