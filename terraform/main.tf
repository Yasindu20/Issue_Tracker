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
        #cloudflare = {
        #    source = "cloudflare/cloudflare"
        #    version = "~> 4.0"
        #}
        mongodbatlas = {
            source = "mongodb/mongodbatlas"
            version = "~> 1.0.0"
        }
        aws = { 
            source = "hashicorp/aws"
            version = "~> 5.0"
        }
    }

    backend "local" {
        path = "terraform.tfstate"
    }
}

provider "vercel" {
    api_token = var.vercel_token
}

#provider "cloudflare" {
#    api_token = var.cloudflare_token
#}

provider "mongodbatlas" {
    public_key = var.mongodb_public_key
    private_key = var.mongodb_private_key
}

provider "aws" {
    region = var.aws_region
    access_key = var.aws_access_key_id
    secret_key = var.aws_secret_access_key
}

# AWS VPC & Subnet 
resource "aws_vpc" "main" {
    cidr_block = "10.0.0.0/16"
    tags = {
        name = "issue_tracker_vpc"
    }
}

resource "aws_subnet" "main" {
    vpc_id = aws_vpc.main.id
    cidr_block = "10.0.0.0/24"
    tags = {
        name = "issue_tracker_subnet"
    }
}

resource "aws_internet_gateway" "main" {
    vpc_id = aws_vpc.main.id
    tags = {
        Name = "issue_tracker_igw"
    }
}

resource "aws_route_table" "main" {
    vpc_id = aws_vpc.main.id
    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.main.id
    }

    tags = {
        Name = "issue_tracker_rt"
    }
}

resource "aws_route_table_association" "main" {
    subnet_id = aws_subnet.main.id
    route_table_id = aws_route_table.main.id
}

# AWS Security Group
resource "aws_security_group" "backend" {
    name = "issue-tracker-backend-sg"
    description = "Allow inbound traffic for backend"
    vpc_id = aws_vpc.main.id

    ingress {
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["112.134.144.32/32"] #My IP address
    }

    ingress {
        from_port = 3000
        to_port = 3000
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"] #App port
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        name = "issue-tracker-backend-sg"
    }
}

# AWS EC2 Instance for Backend
resource "aws_instance" "backend" {
    ami = "ami-0c02fb55956c7d316" 
    instance_type = "t3.micro"
    subnet_id = aws_subnet.main.id
    vpc_security_group_ids = [aws_security_group.backend.id]
    key_name = var.aws_key_name
    associate_public_ip_address = true

    user_data = <<-EOF
                #!/bin/bash
                sudo yum update -y
                sudo yum install -y nodejs npm git
                git clone ${var.github_repo} /app
                cd /app/backend
                echo "MONGODB_URI=${var.mongodb_uri}" >> .env
                echo "JWT_SECRET=${var.jwt_secret}" >> .env
                npm install
                npm install -g pm2  #process Manager for Node.js applications
                pm2 start server.js --name "backend"
                pm2 startup
                pm2 save
                EOF

    tags = {
        name = "issue-tracker-backend-instance"
    }
}

# MongoDB Atlas
resource "mongodbatlas_project" "issue_tracker" {
    name = "issue-tracker"
    org_id = var.mongodb_org_id
}

resource "mongodbatlas_cluster" "free_cluster" {
    project_id = mongodbatlas_project.issue_tracker.id
    name = "issue-tracker-free"
    provider_name = "TENANT"
    backing_provider_name = "AWS"
    provider_region_name = "US_EAST_1"
    provider_instance_size_name = "M0"
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
    value = "https://${aws_instance.backend.public_ip}:3000/api"
    target = ["production"]
}

# cloudflare DNS
# resource "cloudflare_zone" "main" {
#    provider = cloudflare
#    count = var.domain_name != "" ? 1 : 0
#    zone = var.domain_name
#    account_id = var.cloudflare_account_id
# }

# resource "cloudflare_record" "app" {
#    provider = cloudflare
#    count = var.domain_name != "" ? 1 : 0
#    zone_id = cloudflare_zone.main[0].id
#    name = "app"
#    value = vercel_deployment.frontend_prod.url
#    type = "CNAME"
#    proxied = true
# }

# resource "cloudflare_record" "api" {
#    provider = cloudflare
#    count = var.domain_name != "" ? 1 : 0
#    zone_id = cloudflare_zone.main[0].id
#    name = "api"
#    value = railway_service_domain.backend.domain
#    type = "CNAME"
#    proxied = true
# }

