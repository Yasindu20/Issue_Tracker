output "backend_url" {
    description = "Backend service URL"
    value = "https://${aws_instance.backend.public_ip}:3000"
}

output "frontend_url" {
    description = "Frontend Application URL"
    value = vercel_deployment.frontend_prod.url
}

output "mongodb_connection_string" {
    description = "Mongodb Connection String"
    value = mongodbatlas_cluster.free_cluster.connection_strings[0].standard_srv
    sensitive = true
}

output "custom_domain" {
    description = "Custom domain URLs"
    value = var.domain_name != "" ? {
        frontend = "https://app.${var.domain_name}"
        backend = "https://api.${var.domain_name}"
    } : null
}

output "ec2_public_ip" {
    description = "EC2 Public IP"
    value = aws_instance.backend.public_ip
}

output "ssh_connection" {
    description = "SSH connection command"
    value = "ssh -i ~/.ssh/issue-tracker-key.pem ec2-user@${aws_instance.backend.public_ip}"
}