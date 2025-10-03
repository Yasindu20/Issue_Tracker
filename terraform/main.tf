terraform {
    required_version = ">= 1.0.0"
    required_providers {
        railway = {
            source = "terraform-community-providers/railway"
            version = "~> 0.5.0"
        }
        vercel = {
            source = "vercel/vercel"
            version = "~> 2.0"
        }
        cloudflare = {
            source = "cloudflare/cloudflare"
            version = "~> 4.0"
        }
        mongodbatlas = {
            source = "mongodb/mongodbatlas"
            version = "~> 1.0.0"
        }
    }

    backend "local" {
        path = "terraform.tfstate"
    }
}

# Configure the Railway provider
provider "railway" {
    token = var.railway_token
}

provider "vercel" {
    api_token = var.vercel_token
}

provider "cloudflare" {
    api_token = var.cloudflare_token
}

provider "mongodbatlas" {
    public_key = var.mongodb_public_key
    private_key = var.mongodb_private_key
}

# railway backend Deployment
resource "railway_project" "issue_tracker" {
    name = "issue-tracker"
    description = "Issue Tracker Application"
}

resource "railway_environment" "production" {
    name = "production"
    project_id = railway_project.issue_tracker.id
}

resource "railway_service" "backend" {
    name = "backend"
    project_id = railway_project.issue_tracker.id
    source_repo = var.github_repo
    source_repo_branch = "main"
    root_directory = "backend"
}

# Railway Service Domain
resource "railway_service_domain" "backend" {
    service_id = railway_service.backend.id
    environment_id = railway_environment.production.id
    subdomain = "api"
}

resource "railway_variable" "node_env" {
    service_id = railway_service.backend.id
    environment_id = railway_environment.production.id
    name = "NODE_ENV"
    value = "production"
}

resource "railway_variable" "port" {
    service_id = railway_service.backend.id
    environment_id = railway_environment.production.id
    name = "PORT"
    value = "3000"
}

resource "railway_variable" "mongodb_url" {
    service_id = railway_service.backend.id
    environment_id = railway_environment.production.id
    name = "MONGODB_URL"
    value = var.mongodb_uri
}

resource "railway_variable" "jwt_secret" {
    service_id = railway_service.backend.id
    environment_id = railway_environment.production.id
    name = "JWT_SECRET"
    value = var.jwt_secret
}

resource "mongodbatlas_project" "issue_tracker" {
    name = "issue-tracker"
    org_id = var.mongodb_org_id
}

resource "mongodbatlas_cluster" "free_cluster" {
    project_id = mongodbatlas_project.issue_tracker.id
    name = "issue-tracker-free"
    provider_name = "TENANT"
    backing_provider_name = "AWS"
    provider_region_name = "AP_SOUTH_1"
    provider_instance_size_name = "M0"

    # free tier settings
    disk_size_gb = 5

    lifecycle {
        ignore_changes = [disk_size_gb]
    }
}

# vercel frontend Deployment
resource "vercel_project" "frontend" {
    name = "issue-tracker-frontend"
    framework = "create-react-app"

    git_repository = {
        type = "github"
        repo = var.github_repo
    }

    root_directory = "frontend"
}

resource "vercel_deployment" "frontend_prod" {
    project_id = vercel_project.frontend.id
    ref = "main"
    production = true
}

resource "vercel_project_environment_variable" "api_url" {
    project_id = vercel_project.frontend.id
    key = "REACT_APP_API_URL"
    value = "https://${railway_service_domain.backend.domain}/api"
    target = ["production"]
}

# cloudflare DNS
resource "cloudflare_zone" "main" {
    count = var.domain_name != "" ? 1 : 0
    zone = var.domain_name
    account_id = var.cloudflare_account_id
}

resource "cloudflare_record" "app" {
    count = var.domain_name != "" ? 1 : 0
    zone_id = cloudflare_zone.main[0].id
    name = "app"
    value = vercel_deployment.frontend_prod.url
    type = "CNAME"
    proxied = true
}

resource "cloudflare_record" "api" {
    count = var.domain_name != "" ? 1 : 0
    zone_id = cloudflare_zone.main[0].id
    name = "api"
    value = railway_service_domain.backend.domain
    type = "CNAME"
    proxied = true
}

