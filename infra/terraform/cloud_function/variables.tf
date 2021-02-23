variable "function_name" {
  description = "Name of the function to deploy"
  type        = string
}

variable "public" {
  description = "Function is publicly callable"
  type        = bool
}

variable "source_dir" {
  description = "Folder containing the function"
  type        = string
}

variable "bucket_name" {
  description = "Name of the bucket to store function code"
  type        = string
}

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

variable "region" {
  description = "Region to deploy function"
  type        = string
}
