const mongoose = require("mongoose");
const Artist = require("./models/artist");
const Verb = require("./models/verb");

const data = [
	{name: "Jelena Rozga",
	 image: "https://thumbnailer.mixcloud.com/unsafe/300x300/extaudio/d/5/2/0/304e-b09d-42e7-8c17-d41e66d2cf6f",
	 
	 nouns: [
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 80},
		{word: "Poljubac", repeats: 70},
		{word: "Poljubac", repeats: 60},
		{word: "Poljubac", repeats: 50}
	],

	 verbs: [
		{word: "Poljubiti", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90}
	]
	},

	{name: "Severina",
	 image: "https://yt3.ggpht.com/-y2E3TS4SARw/AAAAAAAAAAI/AAAAAAAAAoA/Wohl0H6q6QI/s288-mo-c-c0xffffffff-rj-k-no/photo.jpg",
	
	 nouns: [
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90}
	],
	verbs: [
		{word: "Poljubiti", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90}
	]
	},

	{name: "Oliver Dragojević",
	 image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhIVFhUVFRYVFRcXFxUWFRkXFhUYFxYXFxUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtOCgtLisBCgoKDg0OFxAQGC0dHR0tLS0tLS0rLS0tKystLS0tLS0tLS0tLSstLS0tLS0tLS0tKystLS0tLS0tLS0tKy0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAABBAMBAAAAAAAAAAAAAAAAAQIEBgMFBwj/xABBEAABAwEGAwYDBQYGAQUAAAABAAIRAwQFEiExQVFhcQYTIoGRoQcy8CNCscHRFFJyguHxFSQzYpKysxc1U1Rz/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAeEQEBAAICAwEBAAAAAAAAAAAAAQIRITEDEkFRYf/aAAwDAQACEQMRAD8A4mhCFpAhCFQIQhQCEJVQiEqRNAQlQAToFQiFNoXXVfow8gfDPScirp2U+HzqobVtGJjZ+Q+EnhORyP1qibc+Shdt/wDTOykeGnB44nOEdDkOvJa2t8OGsqNLIIAM5b6CcOsa7TGyJ7OVssVQzDDlyUn/AAG1f/WrHpTc7jwHIrtF1dlaTSC6JbOZAkTzG/FWKjTa2GtJgcMgf1Utiy2vNFai5hLXsc0jUOBaR1BWNenrVc1mqj7ahScCZhzAT6rU3l2Bu6uMIs7aZ40hh9Y2U3Fed0Kz9uuyL7vq5S+g/wCSpG+7HEaO/EdFWFQIQhQCEIQBTU5IUCIQhA5CEIBCEIBCEIBCEKgQhKlAAui9kuxeTX1zBOeBrRijgXuyB5DPmFA7IXGxrG2is0OJM02nRoB+YjjI8l1G7bQcOWnGP1WbRmu+6KFJsilH8Rk/in1rxa3INhQrdbiQR7jX0VfcHl+vmZWPZr0W5l4OI2ClU60iMyN8jn5jVaq6gMspjitvaa3hiQPrgFr2T1R7RVygCPKPxUbvi06zw/pChWtzRq6VFbeDGHFMnnos2rJVre7whxE7xoOXTZRbXeDmgNxRIBPHPgPuhaIX295nEDn94gNHluctVOqW14EupYm7mT9FJdlliSwMqAsq4XtcILXwQQeIIhU7tb8JsbTWsADXamg4kA//AJvJgdDlzVqs9Sm+IEcNvRbey1X0wACSNfoLUrLzHbLK+k91Oqwseww5rsiDzCwyu8/FTs9QtVmdaw3DXotlzhu0bOjUD24rgzhGRWzYSoQoBIgpEDkJqEDkIQgEIQgEIQgEIQqBZrNQLzllxJk+wBlYVsrjdNQNGpOo1AElxnoI80HVuy90hzKWKTDAQDoN/wA41VvqMEBjRmoHZSxltHvKkjLIH8hsBp5LaUxnPFcc7p18WHtUB9hjPJR2WEaEBbo0/NBpclyer1jWsplg1jyKh2sk8frqtxVo5GStbaaI23V2esV62YpyJ6D+igPiTJPnC2dudGma0desC49PrqhZpMsDJeBAjoNwr1clMYe7dpsd2nly5KhXfXGIHhHor9dxkbT7ELU7cfLOGG3WIU3HQE8vC7qNilsttc0xOXB2nk7bzUl1XxGlUzafkdv/AAnmFhdZy12GP4TseWe/JdHnbSi0PHUEFpgggjMcwVxP4odiv2Kp+0UW/wCXquiP/jeROH+E5x6LrtldhMiYmNTHMFp0Wyva62Wuz1LPUEio0jodQRzBgjotRK8qIlZLTQdTe5jwQ5pLSDxBg/gsSoUpEspEAhCEDkIQgEIQqBCEKAQhCAW+7HWYvtDWjVxDRtHiDnH/AItK0KvPwksXeWsnZrfzE/g31Qrsr2eFtNvytAJ89J/HzWenT2TWZknmY/JSqa895r24T1xkM7lL3azJQE0e1QLRTWltjtlv7Y3JV+uM1K1jdtBeDD/ZVm2mDkVcbwbA55qpV2jEZyklIZG3dV8TZ0OX9V0e5KmJsT4okZ/eGX5fWa5hUfGXCIV0uG2ZU3zBENdz4H2W4459LPb2Y2YhqM+hj+6z3XWFVmF3zbdeCx0a2cx4Xajgd/rkowoFlXI+FwlpC286dUs2ZOcxnzjQ/wAQHqp92VjOB2o0PEHP03RQdjAduPmH1yUg0RMjUf3H5qo4V8bbkFC3d60QyuwPOuT5Id0mB6Fc7Xcfj7Qmz0KmHMPLcU6AjMEbgkM81w5bqQISIUUJUiVA5CEIBCEKgQhKgRCVIgF1H4PBrWVXD5i/0AAA959uC5cr58KbUe9dSAOfiLtgBoPdx9Fm9Ds1mGSmUSoNG0NGjhAUqjamnIEFcI9rOsbwU59RQLXeop6+YVTlktDd5PqVq7QyNPryUOv2lJMAOPRpIgcx19kxt44pIcCMwRvrms3TUqLezRhM+R2n8lUq+/p781Zr1tILHNObT6qoOfl0MeRSGVRa0Az9SrDcjyWkScwR5CYPq4Baqz2QvJPAT55ZAKbStjbORO+vSCJ6LW2LOF7o1YDZP984/JbWm7E0Rq04h+Y/MKs3deTajRvIEbjPY9Dut3d7cvC7L8OkLo8m24sbhi4Zeo2KntOfl+H9FVLzvJ7GnuxieJgEhpnkTkfxXOB29tFnrOL3GtUnMF7hTp5yWAN+Z23AZjNN6bxwuXToHxpa3/DHuLSYe0AgThxGJPKY88K85r0v25tItFzVqrR4alBtQbxIDvZeaAujn9oQhCihCEIHIQhAIQhAIQhAIQhALoHwxDQys7KZDf8AcZGnTL3VXum521abqr6kBpgga8cydAtndt40bNlTcRiycQZOfODG2ilqe3LqFKxOqDIwBqZj+ynXfdxYZDtOBPuqy28Xg06VB9R9Spm1pqGMP7zsshrzyUCv2mtLawonFilwcBLsOFxbnjbvqMJOvHJcZjw9ftruOnsdLSVWLdeDDVax5a0feJMQogve0uoOeAMIkFwDQcsjEnaDmB+Co1S+C1+MS44g7ESS4wZ1WdbJ5N8SOqm0WbCMALgNXBjyJ/iiPdQ7S6zkeLD1Ic33AKgUbqNctqVnHA6HFgfDsP7uPUDkFAvbsWDVxUCaNMHEGsAaRLWggubmR4ZgmBnxM6klWzKdcsd5U2Z928HLODMTyMHgsdz9mnWhmPvGUqc/M8yfCYOQy46kaLHabtDHNMklogkwZlv3iIEyJhbwXDTDJLQ6CSC7CADOsAZ+c6Kbkc7M7lrYpXfYqDQ19pL3QJwjI5a+HFHqqh2ptdB1T7FhgACTJ4mfESZ0Uq92EOIxT0yHnmtDaRnHP6yW5lv4ZeL9tqz9m7E/Ih+IZQIIgH8iRn0B2CujWiiA4mCeRzOmcb81rOxrg6jSH7rXA8hilvp9aqxXzZaVWzkPIjCQDpBJAn1j2W9Odx1VK7T9q6bqVRrB42kNBggS6fPQE+SoFvun/LttDM4J71o1a0kBr44SYPUcVl7Z0+4qU6VMuNMsx4jkHuLnNOEbBuGI2z4rH2VtJNoAcZY+nVpvBOWB1F4d6DPyC5u+M1061bXOb2bbEYv2VszwOuvIrz2F6mt9gabsdRLRlZsPASKfHbNeWius6jzZc5UIQhVAhCEDkJMSJQKhEoQCEIQCEqRBNsFQltSls9sgf7m5j65KCdFkpVC0hw1BkKfWu5z4q0m42OzLWwXNM+JpaMxy5EIO1XZdbKLy6cJIbByBAiYB6krZUmCo/L5ZlzsI8X8x101zWOlbaMkuqMGkS5ukDmni96MhlN2NzjAwjw8zi0yEmJnJebb3yxq78Ao2Ms/2kZcTJPuSuUXe8tq03O+XEA7oTr7rrnbGzTTiPurk9ortY7DGQMFXG9seTHiWfHYrgLarS0Z4dOnJbCvYpEY3RwIH6KmdhrY7P9nwvjVj3lrh0OHTqrdWq252YslMc+8DvbJNHt/Gur3cAMIGUOxEhsQeQgTzTKtf7FkkSWg5iYJaDB4apt4uthGF9FpG4xhoPIwCfdV29LXaQZexg2MGRx5cFm/jUlt2g2+JLgYgweAP6a5qRZrnFUB3l/NAgcNyZzBWrpUnOc7GYkgGdNd401Jkc1a7msuAZiMw1zTnDhnH8JEEEcCRkVvBjOs12WfuBA+WMzOWRO2oGuSd2mvf/I1MBzJa0f8AJhd+aj3lUiG+pPDacs1BvRuKxvA2ZUdnxDTC3tPWKZeFpFez2ZjpL+9qua4HMUzhBbHN4kdHcVuLF2d7m2U7LTcXl7Gue6PkpnN4nckDDPBxWm7PWUtcKtUfZNbha8aA7QdiCZz3XR+wLahqVq1bOan2RMZU4+7yw4VnS71Nr3Wdjs7x/sI4ZRGuy8rW2iWVHsOrXOaZ1yML1GxwbRqk5AU366RhK8t2muaj3Pd8ziXHqTJXb48f1iSpEqKEJEqBEJEqAQhCARKRKgWUSkQgXEnByYhB2zsR3NssdJz2AvpjunbGWZAmOLcJ81arJdlJjmhlMA7u+9HCSuS/CW9+7tDrOT4arZbyez9Wz6BdXtFU/dOfsvPnNV7vFlvFj7YuApjT5T6Li1YtdVPCc107tTY7VVpljWtJjM4vwkSSuWW247U050Xgcuu5CTumV6kS6d8Os1VlWhqDpsW7g8l3C5r6Fak17Tk4A9OS4hdPZyoSC9pA1zXR7kHdMDBpEifrglpOe1kvCvIlUe+bR4s5An+x+uasVdxI+YZ/XlvrwVfvezuidWmDIzEHf2WG98NTQeB8wjUHpO3EZ6fQvVkYAwEQRhG5PhJJAG5A2895mg09gdoIPIQSOZBjyPJWS6LX9mJdoYkbTGnLLVdMXLI68j4pP9IyzC0Xaao82RzaYkuLQ6BoHGIjnI9FsbxryRmJ3jSDmSsd323u2VqztGscRzDWzHLT3VPis9l7Q3u61lqMLg+BAPyuaZDgeRAXU+zVkLWNaNGtAB9Cf0XI+y9N1Mh5+Z8+pznyXQr07YtsVABubw0DzjSOK3jN1y8l4b74jWhtK7LQJhzqYaOcuDY88wvOCvDqlS306or1CaryH05ccLSNGxwIy91SajC0lrhBBIIOxGoXWzWnnn01CELKhCEIEQlQgRCVCAQhCAQhCAQhCDPYrU6lUZVYYcxwcPI6dNl6BuG0NtNKnWYZDgDtkTqDG4zELzuV1D4OX1/qWVx0+0pg8Dk8DnJafVY8k3HXx5auv10a2uOJ3XLPOFgJyggTB4aZb8ZlF7XXjmpiOmxiM/daetc7H/NaarRGcET/ANdFxezHCZQ28rZTYPEWhvP1PpKqtr7VtGTHYiIgMzJyOw0W1t1zWRsnAanN7nu9nHkVBsV243hrWNaCc4aAABrlryQyw/Ezs3aa9pzqsLKYMjxDETxI4dOCtF8YWBjIyAj8/wAvdYWBrAxjdAQSeQOv4qN2kdiAMxJnpOX1PBZrMmlUpNGL1ngRofY+w3WyoPgEg5Geo0zORnU88pUJ2GTOee0DaJz6H0Raa+EanlmeGfMbenmemLFqParRJjczPIT9e6g31ef2baAbiL/ujcAzBOwmPdRrZbQMzn+fAdU2zVm0war4xEZk7DYBdMcdueWekyjFBpq1nDGBkB8rAdmjjz1VSvG8nV6mNxyHyjgP1SXtebqzuDRoPzPNQWrp104Xntv7uthaQQpfaawiqz9pYMxAqgbjQP67HyWisjs1vxbMNF7Z1aR7LrOZpzvFVJCzYMQJA01A4cRyWIhcmyIQhQKhCAgEIQgEITxSJ2QMQsndRqUEtHNXQxpzaZKcHnYIIO5QBpxqVKue8TZq1OuzN1NwdGxG7TyIkeaiQOqQv4BB6buu2stFnbWp5seA5vHPUHmDl5KHUsDJkDnyyP16rnvwY7QOD6lieRhe01aU7PbGNo4y3P8AkPFdOc8fX6Lz54vV4ruNLUupuZIk6c/7/qlZYw3rkT9evotlXOX19bLV2q0YZG+2e/LnlosadqwBwBLicwQBplOh0y1C0l528EOaPul2fnBjin3nbDhcOWfCDPmenEDmqdVvb7o0E5jU5D00Prst+m3HLPVbF1fIgxlmd5nL8Xac1ob1vf7rdYgAfj7rFbbyObWAGZiJ9xPCFBp08ObjLjqV1xwcssz6cg43nxfh/VQbZai865BFrtE5BMoUpK3/ACOZ1CjOZTaogqc0QMlCqiSrYh1F0LO61lwcJ+7EfisQowM9U11MHkrumjrE/CcQ6HmNweSW3Ue7fAzY4BzebT+YzHkmjLJbCrS72z5fNRM8yx3zehg+ZU1wn1rsFP8AfP8AxQoyFnbWipwaeCdj4BEOKqAU+JARLRzR3Y3KCQNkAKnAJTiOpTTUTSUDw0blGMDQLGhA91UppKRKgEiVJKgmXTeD7PWp16fzU3Bw5xqDyIkHqu93PflG2UhWoGdC9k+Om46hw676FeeFMuk1+9Y2zF4quIazuyQ4knIZKWbbxyuPTv8AXrEA9MjH1wVetdqkl0mBqDIEayeGk56Zbwrfd/ZdzbIxlqrOfaIxVKgIgOP3RAEgaTqqffHYguOTqjjsMTj6Aa9OfJZmEjV8tyn4pF/3qHPhpmBBdkNtBHr5xsq9gc85ZBdJpfDO0Ozc0Um7YjLz0aNB1M9FBvjsq2ztzdJ9F0mLnc1KwBoy13KhWqrtut6+w+B9Vxhjd+J2aOJK0DKRcZK1fxJdmUKMqa1sIEALBUq8E6GdzthqmNZHVNsm56LK9BgKanOTUCQtjc9p7t4MSNCNiDkQfJa8LIwqxKsv+EWX99yFou/KRa3PxnVRADsIT/2dx1U9z2DcKNXtrYgLlt0QKghMTjJRg4qBqITpCQuQGFCRCBZSIhODUDUJ2SMSBA1Wj4bXq6y3hQeymKhe7ui06xUIBLT90jWeo3VXlXT4RXeyteLS8n7FjqzRxc0taAeXjJ8kSvQMOrP8PyDPFt/UrbULM2mMteO/9FrrjtbowuYGtPyxAjkQNJWa87cGDVaTaHfNuABzXKe0dpdaKoY3OTCsd+W81CQCqX2htf7PTOE/a1QWtO7W/ff12HnwW5NOfdVztLbWveKNP/SoyAf336Pf02HIE7rSlyWMliqHYalS10kNcZ08ysbo0CVxjIJiyqXZB4T1/RLUKWyjw+qZVKvwYnJAUEpAoFhEpYSQqF7xKseFCIwnqkxJqVYaLjQlbTJ0Cd3fFAxACzNYiRxTQYKaUAIe9MVQpfwTUIUUqEIRAtl2cvl9jtFO0MElhzadHNIhzT1B9YWtQqPU1G3irQpV2OgVabajWgZgPaHAH1Ue9bO+q2WO8QGh0PJaT4ZP7y7rO7g1zP8Ag9zR7AK72azb7LbGnPi0NY81PDgBc+dgMyVyu+7wNeo6q7Kcmj91o+UfW5K6X8Zr3Z9nZmAB5GOoRrgHyNPUgn+UcVyO2vgDmYV2kjEXKNi1PHTonvB3PkEwhZroahPFInZP7g8lBnpnwjosDynlrljIQYynNSSsrWoABACzNppzWLWhiwIWbChNI1wpjc+idlsPVTad3uOuSkMsLRrmsNNYJPEprwRtC3HdBQbdGyggEpEIQCEIRAhCEAhCEAhKhB6Y+EtlDbqs3h1D3HzqOMqw3rb2UKT6rzDWNL3dANBz2R2csP7NYrPQ3ZRpsPXAMXvK5t8Zb/yZYmH5oq1Y4A/ZtPUjF/K3itxhzi97yfaa9SvU+ao4ujgNGtHIAAeS09ubJA4KS93DVRyQDAzcVasMFHcrI1gCHvWEklRpldU4JOqxveGqNUtBKmxMe8BYnVwo7KTnbFZm2aNSga/PNZKBnJI9oA1UcOQbRqyBRqFbF1GqkhbgIQiUIic5YKiVC5NIr1CtiEIIaEIQCEIQCEIRAlQhALPYf9Wn/G3/ALBCEHsK0aDp+i87/En/ANytHVn/AImIQtxhVnb9FCs3znoUIStQ92qAhCioVXVFLVCFlWyq6KPSQhbRitWqxIQs0ZrH83kVshp6oQtYhyEIWh//2Q==",
	 nouns: [
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90}
	],
	verbs: [
		{word: "Poljubiti", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90}
	]
	},

    {name: "Mate Mišo Kovač",
    image: "https://i.scdn.co/image/ab67616d0000b273a6f5e0154fa751dfc3e81de0",
	nouns: [
		{word: "Poljubac", repeats: 95},
		{word: "San", repeats: 90},
		{word: "Poljubac", repeats: 80},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90}
	],
	verbs: [
		{word: "Poljubiti", repeats: 190},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90},
		{word: "Poljubac", repeats: 90}
	]
	}
	
]

// nouns: [
// 	['Poljubac', 35],
// 	['Lubav', 25],
// 	['Voljeti', 15],
// 	['Zaboraviti', 10],
// 	['Ljubiti', 9],
// ]



function seedDB(){
	//Remove all artists
	Artist.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed artists");
		
		//add a few campgrounds
		data.forEach(function(seed){
			Artist.create(seed, function(err, artist){
				if(err){
					console.log(err);
				}else{
					console.log("added artist");
				}
			});
		});
	});
};

module.exports = seedDB;






