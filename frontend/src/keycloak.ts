import Keycloak from "keycloak-js";

interface KeycloakConfig {
    url: string,
    realm: string,
    clientId: string
}

const keycloakConfig: KeycloakConfig = {
    url: "http://localhost:8081/",
    realm: "gaming-forum",
    clientId: "gaming-forum-frontend"
}

const keycloak = new Keycloak(keycloakConfig)

export default keycloak