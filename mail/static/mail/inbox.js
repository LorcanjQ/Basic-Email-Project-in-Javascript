document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //below line calls the send_email function below
  document.querySelector('#compose-form').onsubmit = send_email

  // By default, load the inbox
  load_mailbox('inbox');

});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-display').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

//send email is called by the onsubmit above
function send_email() {
  fetch('/emails', { //saves this new email to the emails database
  method: 'POST',
  body: JSON.stringify({ //NB body here can be referred
                        //to by Python as request.body
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: (document.querySelector('#compose-body').value)
  })
  })
  .then(response => response.json())
  .then(data => {
      // Print result to data log
      console.log(data);
  });
  alert("Email Sent!");
  load_mailbox('sent');
  return false;
  }


function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-display').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';


  // Show the mailbox name
  document.querySelector('#mailbox_name').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  document.getElementById("emails_list").innerHTML='';

  fetch('/emails/'+mailbox)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(function(email) {

      var email_div = document.createElement("div");
      email_div.setAttribute("class", "B");
      email_div.addEventListener('click', () => show_email(email.id,mailbox));
      //creates email as a link which calls show_email func
      var toORfrom = document.createElement("h3");

      if (mailbox == "sent"){
            var email_top = 'To: '+ email.recipients;
      } else {
            var email_top = 'From: '+ email.sender;
            if (email.read == false){
              email_div.classList.add('unread');
            }
        }

      email_div.appendChild(toORfrom).append(email_top);

      var email_subject = document.createElement('a');
      //email_subject.href = "";

      var bold = document.createElement('b');
      var subj = 'Subject: ' + email.subject;
      email_subject.appendChild(bold).append(subj);

      email_div.append(email_subject);

      var email_time = ' - Sent on: '+email.timestamp;
      email_div.append(email_time);

      document.getElementById("emails_list").append(email_div);
     })
  });

  return false;
}



function show_email(email_id,mailbox){

  if ( mailbox == 'inbox'){
    fetch('/emails/' + email_id, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
      })
    })
  };

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-display').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  document.getElementById("email-display").innerHTML='';

  fetch('/emails/' + email_id)
  .then(response => response.json())
  .then(email => {
      // **Display full email**
      //email_display_div will be the div that contains all email comps
      var email_display_div = document.createElement("div");
      email_display_div.setAttribute("class", "content");

      //checks if this email has been archived or not, and
      //represents this accordingly on the archive/unarchive button
      var arch_button = document.createElement("button");
      if (mailbox == 'archive'){
        var archived = false; //archived
        arch_button.innerHTML = "Unarchive Email";
      } else{
        var archived = true; //not yet archived
        arch_button.innerHTML = "Archive Email";
      }
      arch_button.setAttribute("class","time");
      arch_button.addEventListener('click',
        () => archive(email_id,archived));
      email_display_div.appendChild(arch_button);


      //create email subject element & input email subject
      var email_subject = document.createElement("h2");
      email_display_div.appendChild(email_subject).append(email.subject);

      //create element & input email timestamp into it
      var e_time = document.createElement("div");
      e_time.setAttribute("class", "time");
      e_time.innerHTML = "Sent on: "+email.timestamp;
      email_display_div.appendChild(e_time);

      //input elements detailing to/from sender
      var recip_list = email.recipients.toString().replace(",",", ");
      if ( mailbox == 'sent'){
            var email_top = 'Sent to: '+ recip_list;
      } else {
            var email_top = 'From: '+ email.sender;
            };
      var email_recip = document.createElement("p");
      var make_small = document.createElement("small");
      email_recip.setAttribute('class','recip');
      email_recip.appendChild(make_small).append(email_top);
      email_display_div.appendChild(email_recip);

      //create and input body of email
      var email_bod = document.createElement("p");
      email_display_div.appendChild(email_bod).append(email.body);

      //reply button after email
      var reply_button = document.createElement("button");
      reply_button.innerHTML = "Reply";
      reply_button.addEventListener('click', function(){
        compose_email();
        document.querySelector('#compose-recipients').value = email.sender;
        if(email.subject.substring(0,3) == 'Re:'){
          var rep_sub = email.subject;
        } else {
          var rep_sub = 'Re: '+ email.subject;
        };


        document.querySelector('#compose-subject').value = rep_sub;
        document.querySelector('#compose-body').value ='\n'+
        'On '+ email.timestamp +', '+ email.sender + ' wrote: \n >> '+email.body ;
      }
    );
      email_display_div.appendChild(reply_button);

      document.getElementById("email-display").append(email_display_div);


  });

}

function archive(id,bool){
  fetch('/emails/' + id, {
  method: 'PUT',
  body: JSON.stringify({
      archived: bool
    })
  })
  if (bool == true){
    alert("Email Archived!");
    } else{
    alert("Email Unarchived!");
  }
  load_mailbox('inbox');

}
