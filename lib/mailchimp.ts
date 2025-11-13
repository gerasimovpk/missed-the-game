import mailchimp from '@mailchimp/mailchimp_marketing';

// Initialize Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export interface MailchimpContact {
  email: string;
  status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending';
  merge_fields?: {
    FNAME?: string;
    LNAME?: string;
    [key: string]: any;
  };
  tags?: string[];
  marketing_permissions?: Array<{
    marketing_permission_id: string;
    enabled: boolean;
  }>;
}

export const addContactToAudience = async (
  email: string,
  marketingConsent: boolean = false,
  tags: string[] = []
): Promise<boolean> => {
  try {
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    if (!audienceId) {
      console.error('MAILCHIMP_AUDIENCE_ID not configured');
      return false;
    }

    const contact: MailchimpContact = {
      email,
      status: 'subscribed',
      tags,
    };

    // Add marketing permissions if consent given
    if (marketingConsent) {
      contact.marketing_permissions = [
        {
          marketing_permission_id: 'marketing_permission_id', // This should be the actual ID from your audience
          enabled: true,
        },
      ];
    }

    await mailchimp.lists.addListMember(audienceId, {
      email_address: contact.email,
      status: contact.status,
      merge_fields: contact.merge_fields,
      marketing_permissions: contact.marketing_permissions,
    });

    // Handle tags separately if provided (tags API is separate in Mailchimp)
    // TODO: Implement tag management if needed using mailchimp.lists.updateListMemberTags()

    return true;
  } catch (error) {
    console.error('Error adding contact to Mailchimp:', error);
    return false;
  }
};

export const updateContactInAudience = async (
  email: string,
  marketingConsent: boolean,
  tags: string[] = []
): Promise<boolean> => {
  try {
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    if (!audienceId) {
      console.error('MAILCHIMP_AUDIENCE_ID not configured');
      return false;
    }

    const subscriberHash = Buffer.from(email.toLowerCase()).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const contact: Partial<MailchimpContact> = {
      status: 'subscribed',
      tags,
    };

    // Update marketing permissions
    if (marketingConsent) {
      contact.marketing_permissions = [
        {
          marketing_permission_id: 'marketing_permission_id', // This should be the actual ID from your audience
          enabled: true,
        },
      ];
    }

    await mailchimp.lists.updateListMember(audienceId, subscriberHash, {
      email_address: email,
      status: contact.status,
      merge_fields: contact.merge_fields,
      marketing_permissions: contact.marketing_permissions,
    });

    // Handle tags separately if provided (tags API is separate in Mailchimp)
    // TODO: Implement tag management if needed using mailchimp.lists.updateListMemberTags()

    return true;
  } catch (error) {
    console.error('Error updating contact in Mailchimp:', error);
    return false;
  }
};
