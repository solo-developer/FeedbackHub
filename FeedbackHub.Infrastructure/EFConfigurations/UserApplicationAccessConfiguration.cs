﻿using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class UserApplicationAccessConfiguration : IEntityTypeConfiguration<UserApplicationAccess>
    {
        public void Configure(EntityTypeBuilder<UserApplicationAccess> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.AdminUser)
                .WithMany(a=>a.AllowedApplications)
                .HasForeignKey(e => e.AdminUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(e => e.Client)
                .WithMany(a=>a.AdminUsersWithAccess) 
                .HasForeignKey(e => e.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(e => e.Application)
                .WithMany(a=>a.UsersWithAccess)
                .HasForeignKey(e => e.ApplicationId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Property(e => e.AdminUserId).IsRequired();
            builder.Property(e => e.ClientId).IsRequired();
            builder.Property(e => e.ApplicationId).IsRequired();
        }
    }
}
