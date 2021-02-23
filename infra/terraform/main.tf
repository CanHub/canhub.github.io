terraform {
  backend "gcs" {
    bucket = "canhub-tf-states"
  }
}

provider "google" {
  project = var.project
  region  = var.region
}

resource "google_storage_bucket" "default" {
  name = "canhub-functions-bucket"
}

locals {
  function = {
    get = {
      bucket_name = google_storage_bucket.default.name
      source_dir  = "../get"
      public      = true
    },
    scrape = {
      bucket_name = google_storage_bucket.default.name
      source_dir  = "../scrape"
      public      = false
    }
  }
}

module "cloud_function" {
  source = "./cloud_function"

  for_each = local.function

  function_name = each.key
  bucket_name   = each.value.bucket_name
  source_dir    = each.value.source_dir
  public        = each.value.public

  secrets               = var.secrets
  environment_variables = var.environment_variables
  service_account_email = var.service_account_email
  region                = var.region
}

resource "google_cloud_scheduler_job" "job" {
  name     = "scraper_job"
  schedule = "0 0/12 * * *"

  http_target {
    uri         = module.cloud_function["scrape"].https_trigger_url
    http_method = "GET"

    oidc_token {
      service_account_email = var.service_account_email
    }
  }
}
