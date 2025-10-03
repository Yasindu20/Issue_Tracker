output "backend_url" {
    description = "Backend service URL"
    value = "https://${railway_service_domain.backend.domain}"
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