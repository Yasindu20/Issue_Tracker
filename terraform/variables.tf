variable "railway_token" {
    description = "Railway API token"
    type = string
    sensitive = true
}

variable "vercel_token" {
    description = "Vercel API token"
    type = string
    sensitive = true
}

varialbe "cloudflare_api_token" {
    description = "Cloudflare API Token"
    type = string
    sensitive = true
    default = ""
}

varialbe "github_repo" {
    description = "Github repository in format 'owner/repo'"
    type = string
}

variable "mongodb_uri" {
    description = "Mongodb connection URI"
    type = string
    sensitive = true
}

variable "jwt_secret" {
    description = "JWT secret key"
    type = string
    sensitive = true
}

varialbe "mongodb_org_id" {
    description = "Mongodb Atlas organization ID"
    type = string
    default = ""
    sensitive = true
}

variable "domain_name" {
    description = "Domain name for the application"
    type = string
    default = ""
}

varialbe "environment" {
    description = "Environment name"
    type = string
    default = "production"

    validation {
        condition = contains(["development", "staging", "production"], var.environment)
        error_message = "Environment must be one pf 'development', 'staging', 'production'"
    }
}