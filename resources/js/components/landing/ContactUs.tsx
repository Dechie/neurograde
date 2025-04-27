const ContactUs = () => {
  return (
    <section
      id="contact"
      className="px-4 md:px-6 py-16 bg-gradient-to-br from-background to-muted rounded-3xl"
    >
      <div className="flex flex-col md:flex-row justify-center items-center max-w-6xl mx-auto">
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-bold text-[#primary] mb-8">
            Get in Touch with Us
          </h2>
          <p className="text-muted-foreground">
            We are here to help you with any questions or support you may need.
            <br />
            Reach out to us, and let’s embark on this learning journey together!
          </p>
        </div>
        <div className="md:w-1/2">
          <form className="bg-card p-8 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-foreground mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 border border-border rounded-md"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-foreground mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-border rounded-md"
                placeholder="Your Email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-foreground mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                className="w-full p-3 border border-border rounded-md"
                placeholder="Your Message"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full !bg-primary !text-primary-foreground p-3 rounded-md hover:!bg-secondary transition duration-200"
            >
              Send Message
            </button>
            </form>
          </div>
        </div>
      </section>
    );
};

export default ContactUs;