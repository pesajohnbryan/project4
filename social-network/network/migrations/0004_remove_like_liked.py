# Generated by Django 3.2.20 on 2023-08-08 15:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_comment_follower_like'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='like',
            name='liked',
        ),
    ]
