import {
  GlacierClient,
  ListVaultsCommand,
  DescribeVaultCommand,
  InitiateJobCommand,
  ListJobsCommand,
  DescribeJobCommand,
  GetJobOutputCommand
} from '@aws-sdk/client-glacier'

window.glacier = {
  GlacierClient,
  ListVaultsCommand,
  DescribeVaultCommand,
  InitiateJobCommand,
  ListJobsCommand,
  DescribeJobCommand,
  GetJobOutputCommand
}
