terraform {
    required_version = ">= 1.0.0"
    required_providers {
        railway = {
            source = "railwayapp/railway"
            version = "~> 0.2.0"
        }
        vercel = {
            source = "vercel/vercel"
            version = "~> 0.15.0"
        }
        cloudflare = {
            source = "cloudflare/cloudflare"
            version = "~> 4.0"
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
    token = var.vercel_token
}

provider "cloudflare" {
    api_token = var.cloudflare_token
}

# railway backend Deployment
resource "railway_project" "issue_tracker" {
    name = "issue-tracker"
    descrption = "Issue Tracker Application"
}

resource "railway_service" "backend" {
    project_id = railway_project.issue_tracker.id
    name = "backend"

    source = {
        repo = "var.github_repo"
        branch = "main"
        root_directory = "backend"
    }

    variables = {
        NODE_ENV = "production"
        port = "3000"
        MONGODB_URL = var.monogodb_uri
        JWT_SECRET = var.jwt_secret
    }
}

resource "mongodbatlas_project" "issue_tracker" {
    name = "issue-tracker"
    org_id = var.mongodb_org_id
}

resource "mongodbatlas_cluster" "free_cluster" {
    project_id = mongodbatlas_project.issue_tracker.id
    name = "issue-tracker-free"

    provider_name = "TENENT"
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

    git_repository {
        type = "github"
        repo = var.github_repo
    }

    root_directory = "frontend"

    environment = [
        {
            key = "REACT_APP_API_URL"
            value = "https://${railway_service.backend.domain}/api"
            target = ["production", "preview"]
        }
    ]
}

# cloudflare DNS
resource "cloudflare_zone" "main" {
    count = var.domain_name != "" ? 1 : 0
    zone = var.domain_name
}

resource "cloudflare_record" "app" {
    count = var.domain_name != "" ? 1 : 0
    zone_id = cloudflare_zone.main[0].id
    name = app
    value = vercel_project.frontend.domain
    type = "CNAME"
    proxied = true
}

resource "cloudflare_record" "api" {
    count =var.domain_name != "" 1 : 0
    zone_id = cloudflare_zone.main[0].id
    name = api
    value = railway_service.backend.domain
    type = "CNAME"
    proxied = true
}

