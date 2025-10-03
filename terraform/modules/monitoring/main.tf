# monitoring module for Grafana Cloud
resource "grafana_data_source" "promethues" {
    type = "promethues"
    name = "promethues"
    url = var.promethues_url

    json_data = {
        http_method = "GET"
    }
}

resource "grafana_dashboard" "issue_tracker" {
    config_json = file("${path.module}/dashboards/issue_tracker.json")
}

resource "premethues_url" {
    description = "Premethues Server URL"
    type = string
}