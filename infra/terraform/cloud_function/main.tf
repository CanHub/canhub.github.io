# TODO: commit hash as zip name
# TODO: increment version?
# resource "random_string" "default" {
#   length  = 5
#   special = false
# }

# locals {
#   function_name = "${var.function_name}-${random_string.default.result}"
# }

data "archive_file" "default" {
  type        = "zip"
  source_dir  = var.source_dir
  output_path = "dist/${var.function_name}.zip"
}

resource "google_storage_bucket_object" "default" {
  name   = "${var.function_name}.zip"
  bucket = var.bucket_name
  source = data.archive_file.default.output_path
}

resource "google_cloudfunctions_function" "default" {
  name    = var.function_name
  runtime = "nodejs14"

  available_memory_mb   = 256
  source_archive_bucket = var.bucket_name
  source_archive_object = google_storage_bucket_object.default.name
  trigger_http          = true
  entry_point           = "handler"
  region                = var.region

  environment_variables = var.environment_variables
}

resource "google_cloudfunctions_function_iam_member" "default" {
  project        = google_cloudfunctions_function.default.project
  region         = google_cloudfunctions_function.default.region
  cloud_function = google_cloudfunctions_function.default.name

  role = "roles/cloudfunctions.invoker"

  member = var.public == true ? "allUsers" : "serviceAccount:${var.service_account_email}"
}

resource "google_secret_manager_secret_iam_member" "default" {
  project = google_cloudfunctions_function.default.project

  for_each = toset(var.secrets)

  secret_id = each.value

  role   = "roles/secretmanager.secretAccessor"
  member = "serviceAccount:${var.service_account_email}"

}
