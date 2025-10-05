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

variable "cloudflare_token" {
    description = "Cloudflare API Token"
    type = string
    sensitive = true
    default = ""
}

variable "cloudflare_account_id" {
    description = "Cloudflare Account ID"
    type = string
    default = ""
}

variable "github_repo" {
    description = "Github repository in format 'owner/repo'"
    type = string
}

variable "mongodb_uri" {
    description = "Mongodb connection URI"
    type = string
    sensitive = true
}

variable "mongodb_public_key" {
    description = "Mongodb Atlas public API key"
    type = string
    sensitive = true
}

variable "mongodb_private_key" {
    description = "Mongodb Atlas private API key"
    type = string
    sensitive = true
}

variable "jwt_secret" {
    description = "JWT secret key"
    type = string
    sensitive = true
}

variable "mongodb_org_id" {
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

variable "environment" {
    description = "Environment name"
    type = string
    default = "production"

    validation {
        condition = contains(["development", "staging", "production"], var.environment)
        error_message = "Environment must be one of 'development', 'staging', 'production'"
    }
}

#aws_variables
variable "aws_access_key_id" {
    description = "AWS Access Key ID"
    type = string
    sensitive = true
}

variable "aws_secret_access_key" {
    description = "AWS Secret Access Key"
    type = string
    sensitive = true
}

variable "aws_region" {
    description = "AWS Region"
    type = string
    default = "us-east-1"
}

variable "aws_key_name" {
    description = "AWS EC2 key pair name #Optional for SSH access"
    type = string
    default = ""
}