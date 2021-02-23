output "name" {
  description = "Function name"
  value       = var.function_name
}

output "https_trigger_url" {
  description = "URL to trigger the function"
  value       = google_cloudfunctions_function.default.https_trigger_url
}
