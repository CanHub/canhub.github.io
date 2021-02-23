variable "secrets" {
  description = "Secrets to give the function access"
  type        = list(string)
}

variable "environment_variables" {
  description = "Environment variables for the functions"
  type        = map(any)
}

variable "service_account_email" {
  description = "Service account for internal authentication"
  type        = string
}

variable "project" {
  description = "Project name in google cloud"
  type        = string
}

variable "region" {
  description = "Region to deploy resources"
  type        = string
}
